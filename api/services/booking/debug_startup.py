from app.db.session import engine, Base
from app.models import booking

print("Creating tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")
except Exception as e:
    print(f"Error creating tables: {e}")
    import traceback
    traceback.print_exc()
