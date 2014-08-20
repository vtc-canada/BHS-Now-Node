USE cred;
DROP PROCEDURE if EXISTS `DeleteSaleAndMappings` ;

DELIMITER $$
CREATE PROCEDURE `DeleteSaleAndMappings`(IN saleId INT)
BEGIN
	DELETE FROM cur_sales_history_contact_mapping
	WHERE cur_sales_record_history_id = saleId;
	
	DELETE FROM cur_sales_record_history
	WHERE id = saleId;
END$$
DELIMITER ;