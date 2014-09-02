USE cred;
DROP PROCEDURE if EXISTS `GetAddress` ;

DELIMITER $$
CREATE PROCEDURE `GetAddress`(IN addressId INT)
BEGIN
	SELECT 
id AS 'address_id'
,street_number_begin
,street_number_end
,street_name
,postal_code
,city
,address_type_id
,province
,latitude
,longitude
FROM 
`cur_address`
WHERE id = addressId;
END$$
DELIMITER ;
