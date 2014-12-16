USE cred;
DROP PROCEDURE if EXISTS `CreateCompany` ;

DELIMITER $$
CREATE PROCEDURE `CreateCompany`(IN companyName VARCHAR(128), IN paramPhone_number VARCHAR(512), OUT id INT)
BEGIN
	INSERT INTO cur_company(name,phone_number) VALUES (companyName,paramPhone_number);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
