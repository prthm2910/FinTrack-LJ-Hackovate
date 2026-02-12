import sys
import traceback

try:
    # Import and run data ingestion
    from data_ingestion import insert_data
    insert_data()
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print(f"\n📋 Full traceback:")
    traceback.print_exc()
    sys.exit(1)
