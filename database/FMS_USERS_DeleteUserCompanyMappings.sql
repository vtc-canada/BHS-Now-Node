DROP procedure IF EXISTS `FMS_USERS_DeleteUserCompanyMappings`;

DELIMITER $$
CREATE PROCEDURE `FMS_USERS_DeleteUserCompanyMappings`(IN paramUser_ID INT(11))
BEGIN
DELETE FROM cur_user_company_mapping
WHERE 
user_ID = paramUser_ID;
END$$

DELIMITER ;