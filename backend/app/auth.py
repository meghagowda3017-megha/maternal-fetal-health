from datetime import datetime, timedelta, timezone
from hashlib import sha256

import bcrypt
from jose import JWTError, jwt


# ==================================================
# JWT CONFIGURATION
# ==================================================

SECRET_KEY = "maternal-health-wellness-secret-key-change-later"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


# ==================================================
# PASSWORD HELPERS
# ==================================================

def _prepare_password(password: str) -> bytes:
    """
    Convert the password to a fixed-length SHA-256 digest
    before sending it to bcrypt.

    This avoids bcrypt's 72-byte password limitation while
    still using bcrypt for password hashing.
    """

    return sha256(
        password.encode("utf-8")
    ).digest()


def hash_password(password: str) -> str:
    """
    Hash a user's password using bcrypt.
    """

    password_bytes = _prepare_password(password)

    hashed_password = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )

    return hashed_password.decode("utf-8")


def verify_password(
    password: str,
    password_hash: str
) -> bool:
    """
    Verify a plain-text password against
    the stored bcrypt hash.
    """

    password_bytes = _prepare_password(password)

    return bcrypt.checkpw(
        password_bytes,
        password_hash.encode("utf-8")
    )


# ==================================================
# JWT TOKEN
# ==================================================

def create_access_token(user_id: int) -> str:
    """
    Create a JWT access token containing the user's ID.
    """

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decode_access_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            return None

        return int(user_id)

    except (
        JWTError,
        ValueError,
        TypeError
    ):
        return None