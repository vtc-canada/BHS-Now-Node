USE cred;
DROP PROCEDURE if EXISTS `UpdateAddress` ;

CREATE PROCEDURE `UpdateAddress`(IN addressID INT, IN streetNumberBegin VARCHAR(64), IN streetNumberEnd VARCHAR(64), IN streetName VARCHAR(256)
		,IN postalCode VARCHAR(32), IN city VARCHAR(64), IN province VARCHAR(45), IN latitude FLOAT, IN longitude FLOAT)

UPDATE cur_address 
	SET street_number_begin = streetNumberBegin
		,street_number_end = streetNumberEnd
		,street_name = streetName
		,postal_code = postalCode
		,city = city
		,province = province
		,latitude = latitude
		,longitude = longitude		
WHERE cur_address.id = addressID;