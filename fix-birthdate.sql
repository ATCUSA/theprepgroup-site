-- Fix the birthdate column in the user table
ALTER TABLE "user" ALTER COLUMN "birthdate" TYPE date USING 
  CASE 
    WHEN "birthdate" IS NULL THEN NULL
    ELSE "birthdate"::date
  END;

-- Fix the birthdate column in the access_request table
ALTER TABLE "access_request" ALTER COLUMN "birthdate" TYPE date USING 
  CASE 
    WHEN "birthdate" IS NULL THEN NULL
    ELSE "birthdate"::date
  END;
