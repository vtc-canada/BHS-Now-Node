USE cred;
DROP PROCEDURE if EXISTS `UpdateAddress` ;

CREATE PROCEDURE `UpdateAddress`(IN addressID INT, IN streetNumberBegin INT, IN streetNumberEnd INT, IN streetName VARCHAR(256)
		,IN postalCode VARCHAR(32), IN city VARCHAR(64), IN province VARCHAR(45) )

UPDATE cur_address 
	SET street_number_begin = streetNumberBegin
		,street_number_end = streetNumberEnd
		,street_name = streetName
		,postal_code = postalCode
		,city = city
		,province = province
WHERE cur_address.id = addressID;