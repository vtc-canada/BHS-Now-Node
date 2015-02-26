DROP procedure IF EXISTS `NMS_BASE_UpdateUser`;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_UpdateUser`(IN paramId INT(11),IN firstName VARCHAR(255),IN lastName VARCHAR(255), IN paramPassword VARCHAR(255)
,IN phoneNumber VARCHAR(64),IN paramEmail VARCHAR(255),IN paramActive TINYINT(1),IN paramLoginattempts INT,IN paramLocale VARCHAR(255))
BEGIN
	UPDATE users
SET 
password = IF(paramPassword IS NULL,password,paramPassword)
,first_name = firstName
,last_name = lastName
,phone_number = phoneNumber
,email = paramEmail
,active = paramActive
,loginattempts = paramLoginattempts
,locale = paramLocale
,updatedAt = UTC_TIMESTAMP()
WHERE id = paramId;
END$$

DELIMITER ;

