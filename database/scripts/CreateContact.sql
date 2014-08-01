USE cred;
DROP PROCEDURE if EXISTS `CreateContact` ;

DELIMITER $$
CREATE PROCEDURE `CreateContact`(IN contactName VARCHAR(256), IN email VARCHAR(64), OUT id INT)
BEGIN
	INSERT INTO `cur_contacts`(`name`,`email`,`is_deleted`) VALUES (contactName, email, 0);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
