"""Add subscription fields to User

Revision ID: 1204ee420b64
Revises: 1a31ce608336
Create Date: 2025-03-19 16:11:30.715497

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes

# revision identifiers, used by Alembic.
revision = '1204ee420b64'
down_revision = '1a31ce608336'
branch_labels = None
depends_on = None

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('useragent',
        sa.Column('user_agent', sqlmodel.sql.sqltypes.AutoString(length=512), nullable=False),
        sa.Column('device', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=False),
        sa.Column('browser', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=True),
        sa.Column('os', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=True),
        sa.Column('percentage', sa.Float(), nullable=True),
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_useragent_user_agent'), 'useragent', ['user_agent'], unique=True)
    op.add_column('user', sa.Column('has_subscription', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('user', sa.Column('is_trial', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('user', sa.Column('is_deactivated', sa.Boolean(), nullable=False, server_default='false'))
    # ### end Alembic commands ###

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'is_deactivated')
    op.drop_column('user', 'is_trial')
    op.drop_column('user', 'has_subscription')
    op.drop_index(op.f('ix_useragent_user_agent'), table_name='useragent')
    op.drop_table('useragent')
    # ### end Alembic commands ###