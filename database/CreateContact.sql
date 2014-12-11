DROP PROCEDURE if EXISTS `CreateContact` ;

DELIMITER $$
CREATE PROCEDURE `CreateContact`(IN firstName VARCHAR(256),IN middleName VARCHAR(256), IN lastName VARCHAR(256),IN email VARCHAR(64), 
				IN phoneNumber VARCHAR(64),IN dateOfBirth DATE,IN driversLicense VARCHAR(64),IN passport VARCHAR(64),
				IN nationality VARCHAR(64), IN gender VARCHAR(64),OUT id INT)
BEGIN
	INSERT INTO cur_contacts(first_name
		,middle_name
		,last_name
		,email
		,phone_number
		,date_of_birth
		,drivers_license
		,passport_no
		,nationality
		,gender
		,is_deleted) 
	VALUES (firstName
		,middleName
		,lastName
		,email
		,phoneNumber
		,dateOfBirth
		,driversLicense
		,passport
		,nationality
		,gender
		,0);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
