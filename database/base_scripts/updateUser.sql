USE `now_management_base`;
DROP procedure IF EXISTS `updateUser`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`%` PROCEDURE `updateUser`(IN paramId INT(11),IN paramPassword VARCHAR(255)
,IN paramEmail VARCHAR(255),IN paramActive TINYINT(1),IN paramLoginattempts INT,IN paramLocale VARCHAR(255))
BEGIN
	UPDATE users
SET 
password = IF(paramPassword IS NULL,password,paramPassword)
,email = paramEmail
,active = paramActive
,loginattempts = paramLoginattempts
,locale = paramLocale
,updatedAt = UTC_TIMESTAMP()
WHERE id = paramId;
END$$

DELIMITER ;

