USE cred;
DROP PROCEDURE if EXISTS `CreateSalesContactMapping` ;

DELIMITER $$
CREATE PROCEDURE `CreateSalesContactMapping`(IN salesRecord INT,IN contactID INT, IN buildingID INT,IN contactType INT, OUT id INT)
BEGIN
	INSERT INTO cur_sales_history_contact_mapping(cur_sales_record_history_id, contact_id, cur_buildings_id,ref_contact_type_id) 
	VALUES (salesRecord, contactID, buildingID, contactType);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
