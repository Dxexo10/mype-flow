from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '15e1b39f3fb2'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('benchmark_nacional',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('anio', sa.Integer(), nullable=False),
    sa.Column('metrica', sa.String(length=100), nullable=False),
    sa.Column('valor', sa.Numeric(precision=10, scale=4), nullable=False),
    sa.Column('segmento', sa.String(length=30), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('empresa',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ruc', sa.String(length=11), nullable=False),
    sa.Column('razon_social', sa.String(length=255), nullable=False),
    sa.Column('regimen_societario', sa.String(length=50), nullable=True),
    sa.Column('tamano', sa.String(length=20), nullable=False),
    sa.Column('sector', sa.String(length=100), nullable=True),
    sa.Column('departamento', sa.String(length=100), nullable=True),
    sa.Column('capital_social', sa.Numeric(precision=12, scale=2), nullable=True),
    sa.Column('fecha_constitucion', sa.Date(), nullable=True),
    sa.Column('es_formal', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('ruc')
    )
    op.create_table('factura_negociable',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('empresa_id', sa.Integer(), nullable=True),
    sa.Column('monto', sa.Numeric(precision=12, scale=2), nullable=False),
    sa.Column('fecha_emision', sa.Date(), nullable=False),
    sa.Column('fecha_negociacion', sa.Date(), nullable=True),
    sa.Column('estado', sa.String(length=30), nullable=True),
    sa.ForeignKeyConstraint(['empresa_id'], ['empresa.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('historial_tamano',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('empresa_id', sa.Integer(), nullable=True),
    sa.Column('anio', sa.Integer(), nullable=False),
    sa.Column('tamano', sa.String(length=20), nullable=False),
    sa.ForeignKeyConstraint(['empresa_id'], ['empresa.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('empresa_id', 'anio', name='uq_empresa_anio')
    )
    op.create_table('scoring',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('empresa_id', sa.Integer(), nullable=True),
    sa.Column('tipo_modelo', sa.String(length=30), nullable=False),
    sa.Column('probabilidad', sa.Numeric(precision=5, scale=4), nullable=False),
    sa.Column('version_modelo', sa.String(length=20), nullable=True),
    sa.Column('features_usadas', sa.JSON(), nullable=True),
    sa.Column('fecha_evaluacion', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['empresa_id'], ['empresa.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tramite',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('empresa_id', sa.Integer(), nullable=True),
    sa.Column('tipo', sa.String(length=50), nullable=False),
    sa.Column('estado', sa.String(length=30), nullable=True),
    sa.Column('requiere_notaria', sa.Boolean(), nullable=True),
    sa.Column('fecha_inicio', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('fecha_fin', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['empresa_id'], ['empresa.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    op.drop_table('tramite')
    op.drop_table('scoring')
    op.drop_table('historial_tamano')
    op.drop_table('factura_negociable')
    op.drop_table('empresa')
    op.drop_table('benchmark_nacional')
