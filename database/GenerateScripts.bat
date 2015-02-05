 
@Try to delete the file only if it exists
IF EXIST StoredProcedures.sql del /F StoredProcedures.sql


FOR %%A IN (*.SQL) DO (

 if /i "%%A" NEQ "StoredProcedures.sql"  TYPE %%A >> StoredProcedures.sql 
   echo. >> StoredProcedures.sql
)
