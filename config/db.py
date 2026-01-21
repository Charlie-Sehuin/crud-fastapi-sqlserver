from sqlalchemy import create_engine, MetaData

engine = create_engine(
    'mssql+pyodbc://@.\\SQLEXPRESS/Northwind?'
    'driver=ODBC+Driver+17+for+SQL+Server&'
    'trusted_connection=yes&'
    'encrypt=no',
    echo=False,
    pool_pre_ping=True
)

# Lazy connection - se conecta cuando se necesita
conn = None

def get_connection():
    global conn
    if conn is None:
        conn = engine.connect()
    return conn