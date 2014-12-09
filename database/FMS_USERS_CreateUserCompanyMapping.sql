DROP procedure IF EXISTS `FMS_USERS_CreateUserCompanyMapping`;

DELIMITER $$
CREATE PROCEDURE `FMS_USERS_CreateUserCompanyMapping`(IN paramUser_ID INT(11),IN paramCompany_ID INT(11))
BEGIN
INSERT INTO cur_user_company_mapping (user_ID, company_ID)
VALUES (paramUser_ID, paramCompany_ID);
END$$

DELIMITER ;