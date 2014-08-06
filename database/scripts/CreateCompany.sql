USE cred;
DROP PROCEDURE if EXISTS `CreateCompany` ;

DELIMITER $$
CREATE PROCEDURE `CreateCompany`(IN companyName VARCHAR(128), OUT id INT)
BEGIN
	INSERT INTO cur_company(name) VALUES (companyName);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
