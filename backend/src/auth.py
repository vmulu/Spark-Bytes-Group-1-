from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# Secret key and algorithm
SECRET_KEY = ""
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

auth_router = APIRouter()

# Simulated user database
fake_users_db = {
    "student": {
        "username": "student",
        "full_name": "Student User",
        "email": "student@example.com",
        "hashed_password": "$2b$12$P6DgbNf/3Fq/xnmqfqTHV.9ZD4d1nLLaJYFTQwNWSu4My4k0RainS",
        "disabled": False,
    }
}

def verify_password(plain_password, hashed_password):
    result = pwd_context.verify(plain_password, hashed_password)
    print(f"Verifying password: {plain_password} == {hashed_password} -> {result}")
    return result

def get_user(username: str):
    user = fake_users_db.get(username)
    return user

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        print(f"User '{username}' not found.")
        return False
    if not verify_password(password, user["hashed_password"]):
        print(f"Password for user '{username}' does not match.")
        return False
    print(f"User '{username}' authenticated successfully.")
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@auth_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"Attempting to authenticate user '{form_data.username}'")
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        print("Authentication failed.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token = create_access_token(
        data={"sub": user["username"]}
    )
    print("Authentication succeeded.")
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.get("/protected")
async def protected_route(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"message": f"Hello, {username}!"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")