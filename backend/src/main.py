import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from jose import JWTError, jwt
from datetime import datetime, timedelta
from starlette.config import Config
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqlmodel import SQLModel
from .db.session import engine, get_session
from .db.sqlite_manager import SQLiteManager
from .models.user import User
from .routers.database_endpoints_generator import DatabaseEndpointGenerator

from .utils.settings import SETTINGS
from fastapi.responses import JSONResponse


logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles the creation and destruction of the application
    """
    logger.info("Creating application")
    try:
        # import models so the table gets created
        from .models.user import User
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        yield
    finally:
        pass


app = FastAPI(lifespan=lifespan)

# Add routers
generator = DatabaseEndpointGenerator()
generator.register_table(SQLiteManager(get_session, model=User))
app.include_router(generator.router)


ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60

config = Config(environ={
    'GOOGLE_CLIENT_ID': SETTINGS.google_client_id,
    'GOOGLE_CLIENT_SECRET': SETTINGS.google_client_secret,
})
oauth = OAuth(config)

oauth.register(
    name='google',
    client_id=SETTINGS.google_client_id,
    client_secret=SETTINGS.google_client_secret,
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
    api_base_url='https://openidconnect.googleapis.com/v1/',
    client_kwargs={
        'scope': 'openid email profile',
    },
    server_metadata_url= 'https://accounts.google.com/.well-known/openid-configuration'
)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, SETTINGS.google_secret_key, algorithm=ALGORITHM)

def get_current_user(request: Request):
    token = request.cookies.get('access_token')
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Not authenticated',
        )
    try:
        payload = jwt.decode(token, SETTINGS.google_secret_key, algorithms=[ALGORITHM])
        email = payload.get('sub')
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Could not validate credentials',
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Could not validate credentials',
        )
    return email

@app.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get('/auth/callback')
async def auth_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = await oauth.google.userinfo(token=token)
    email = user_info['email']

    access_token = create_access_token(data={'sub': email})
    response = RedirectResponse(url='http://localhost:3000/')
    response.set_cookie(
        key='access_token',
        value=access_token,
        httponly=True,
        samesite='lax',
        secure=False,  # Set to True in production
    )
    return response

@app.get('/protected')
async def protected_route(current_user: str = Depends(get_current_user)):
    return {'message': f'Hello, {current_user}'}

@app.get('/logout')
async def logout():
    response = JSONResponse({'message': 'Logged out'})
    response.delete_cookie(
        key='access_token',
        httponly=True,
        samesite='lax',
        secure=False,  # Set to True in production
    )
    return response

# Add CORS middleware to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,  # Important to allow cookies
    allow_methods=['*'],
    allow_headers=['*'],
)

# Add Session middleware
app.add_middleware(
    SessionMiddleware,
    secret_key=SETTINGS.google_secret_key,
)
