DROP PROCEDURE if EXISTS `UpdateAddressByCompanyId` ;

DELIMITER $$
CREATE PROCEDURE `UpdateAddressByCompanyId`(IN companyID INT, IN streetNumberBegin VARCHAR(64), IN streetNumberEnd VARCHAR(64), IN streetName VARCHAR(256)
		,IN postalCode VARCHAR(32), IN city VARCHAR(64), IN province VARCHAR(45))
BEGIN
UPDATE cur_company AS c
	SET cur_company.street_number_begin = streetNumberBegin
		,cur_company.street_number_end = streetNumberEnd
		,cur_company.street_name = streetName
		,cur_company.postal_code = postalCode
		,cur_company.city = city
		,cur_company.province = province
WHERE (cur_company.id = companyID);
END$$
DELIMITER ;
