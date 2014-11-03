DROP PROCEDURE if EXISTS `BHS_REPORTS_GetDevicesByEquipID` ;

CREATE PROCEDURE `BHS_REPORTS_GetDevicesByEquipID`(IN `v_eqp_ID` INT(11))
BEGIN
	SELECT * 
	FROM cfg_dev_id 
	WHERE eqp_ID = v_eqp_ID;
END