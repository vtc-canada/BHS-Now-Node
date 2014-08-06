USE cred;
DROP PROCEDURE if EXISTS `UpdateSalesContactMapping` ;

DELIMITER $$
CREATE PROCEDURE `UpdateSalesContactMapping`(IN mappingID INT, IN salesRecord INT,IN contactID INT, IN buildingID INT,IN contactType INT)
BEGIN
	UPDATE cur_sales_history_contact_mapping
		SET	
			cur_sales_record_history_id = salesRecord
			,contact_id = contactID
			,cur_buildings_id = buildingID
			,ref_contact_type_id = contactType
	WHERE cur_sales_history_contact_mapping.id = mappingID;
END$$
DELIMITER ;
