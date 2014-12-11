DROP PROCEDURE if EXISTS `UpdateContact` ;

DELIMITER $$
CREATE PROCEDURE `UpdateContact`(IN contactID INT, IN firstName VARCHAR(256), IN middleName VARCHAR(256),
			IN lastName VARCHAR(256), IN email VARCHAR(64), IN phoneNumber VARCHAR(64),
			IN dateOfBirth DATE,IN driversLicense VARCHAR(64),IN passport VARCHAR(64),IN nationality VARCHAR(64), IN gender VARCHAR(64))
BEGIN
	UPDATE cur_contacts
		SET first_name = firstName
		,middle_name = middleName
		,last_name = lastName
		,email = email
		,phone_number = phoneNumber
		,date_of_birth = dateOfBirth
		,drivers_license = driversLicense
		,passport_no = passport
		,nationality = nationality
		,gender = gender
	WHERE
		id = contactID;
END$$
DELIMITER ;
