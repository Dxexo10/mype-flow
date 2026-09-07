from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'bc9265af3d81'
down_revision: Union[str, Sequence[str], None] = '15e1b39f3fb2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('empresa', sa.Column('distrito', sa.String(length=100), nullable=True))


def downgrade() -> None:
    op.drop_column('empresa', 'distrito')
