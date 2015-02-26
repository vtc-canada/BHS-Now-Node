DROP PROCEDURE if EXISTS `CreateAirplane` ;

DELIMITER $$
CREATE PROCEDURE `CreateAirplane`(IN serialNo VARCHAR(256),IN resourceCategory VARCHAR(256), IN callSign VARCHAR(256),
			IN wingType VARCHAR(256),IN companyID VARCHAR(64),IN seats VARCHAR(64),OUT id INT)
BEGIN
	INSERT INTO cur_airplanes(
		serial_number
		,resource_category
		,fixed_wing_type
		,call_sign
		,cur_company_id
		,seats
		,is_deleted) 
	VALUES (serialNo
		,resourceCategory
		,callSign
		,wingType
		,companyID
		,seats
		,0);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
