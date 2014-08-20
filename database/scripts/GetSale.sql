USE cred;
DROP PROCEDURE if EXISTS `GetSale` ;

DELIMITER $$
CREATE PROCEDURE `GetSale`(IN saleID INT)
BEGIN
SELECT * FROM
cur_sales_record_history
WHERE
	cur_sales_record_history.id = saleID;
END$$
DELIMITER ;	
