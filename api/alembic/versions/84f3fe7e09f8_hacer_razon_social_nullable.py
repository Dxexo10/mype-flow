"""Hacer razon_social nullable

Revision ID: 84f3fe7e09f8
Revises: bc9265af3d81
Create Date: 2026-09-07 14:48:39.868605

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '84f3fe7e09f8'
down_revision: Union[str, Sequence[str], None] = 'bc9265af3d81'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('empresa', 'razon_social', nullable=True)

def downgrade() -> None:
    op.alter_column('empresa', 'razon_social', nullable=False)
