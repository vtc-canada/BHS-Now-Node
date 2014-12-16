USE cred;
DROP PROCEDURE if EXISTS `UpdateAddressByCompanyId` ;

DELIMITER $$
CREATE PROCEDURE `UpdateAddressByCompanyId`(IN contactID INT, IN streetNumberBegin VARCHAR(64), IN streetNumberEnd VARCHAR(64), IN streetName VARCHAR(256)
		,IN postalCode VARCHAR(32), IN city VARCHAR(64), IN province VARCHAR(45), IN latitude FLOAT, IN longitude FLOAT)
BEGIN
UPDATE cur_address AS c
INNER JOIN cur_company_address_mapping AS g ON c.id = g.cur_address_id
	SET c.street_number_begin = streetNumberBegin
		,c.street_number_end = streetNumberEnd
		,c.street_name = streetName
		,c.postal_code = postalCode
		,c.city = city
		,c.province = province
		,c.latitude = latitude
		,c.longitude = longitude
WHERE (g.cur_contact_id = contactID);
END$$
DELIMITER ;
