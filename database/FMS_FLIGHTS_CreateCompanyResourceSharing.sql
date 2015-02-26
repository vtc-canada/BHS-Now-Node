
DROP procedure IF EXISTS `FMS_FLIGHTS_CreateCompanyResourceSharing`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_CreateCompanyResourceSharing`(IN curLegsId INT(11), IN curCompanyId INT(11), IN seats INT(11))
BEGIN
	INSERT INTO cur_leg_resource_sharing (`cur_legs_id`,`cur_company_id`,`seats`)
	VALUES (curLegsId, curCompanyId, seats);
END$$
