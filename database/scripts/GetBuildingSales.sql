USE cred;
DROP PROCEDURE if EXISTS `GetBuildingSales` ;

DELIMITER $$
CREATE PROCEDURE `GetBuildingSales`(IN buildingID int)
BEGIN
SELECT cur_sales_record_history.id AS 'sale_id'
	,cur_sales_record_history.sale_price
	,buildingID AS 'building_id'
	,cur_sales_record_history.property_mgmt_company
	,cur_sales_record_history.sale_date
	,GROUP_CONCAT(DISTINCT owner_contact.name SEPARATOR ', ') AS 'owner'
	,GROUP_CONCAT(DISTINCT seller_contact.name SEPARATOR ', ') AS 'seller'
	,GROUP_CONCAT(DISTINCT agent_contact.name SEPARATOR ', ') AS 'agent'
FROM cur_sales_record_history
LEFT JOIN cur_sales_history_contact_mapping AS owner_sale ON (owner_sale.cur_sales_record_history_id = cur_sales_record_history.id AND owner_sale.ref_contact_type_id = 1) 
LEFT JOIN cur_sales_history_contact_mapping AS seller_sale ON (seller_sale.cur_sales_record_history_id = cur_sales_record_history.id AND seller_sale.ref_contact_type_id = 2) 
LEFT JOIN cur_sales_history_contact_mapping AS agent_sale ON (agent_sale.cur_sales_record_history_id = cur_sales_record_history.id AND agent_sale.ref_contact_type_id = 3) 
LEFT JOIN cur_contacts AS owner_contact ON (owner_contact.id = owner_sale.contact_id)
LEFT JOIN cur_contacts AS seller_contact ON (seller_contact.id = seller_sale.contact_id)
LEFT JOIN cur_contacts AS agent_contact ON (agent_contact.id = agent_sale.contact_id)
WHERE (owner_sale.cur_buildings_id = buildingID OR seller_sale.cur_buildings_id = buildingID  OR agent_sale.cur_buildings_id = buildingID )
GROUP BY cur_sales_record_history.id;
END$$
DELIMITER ;	
