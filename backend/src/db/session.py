from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from ..utils.settings import SETTINGS

DATABASE_URL = f"sqlite+aiosqlite:///{SETTINGS.database_name}.db"

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session() -> AsyncSession:
    """
    Access the database session

    :return: a database session
    """
    async with AsyncSession(engine) as session:
        yield session
