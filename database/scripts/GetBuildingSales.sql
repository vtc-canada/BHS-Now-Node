USE cred;
DROP PROCEDURE if EXISTS `GetBuildingSales` ;

DELIMITER $$
CREATE PROCEDURE `GetBuildingSales`(IN buildingID int)
BEGIN
SELECT 
	tempContactMappingBase.* 
	,tempContactMappingOwners.owner
	,tempContactMappingSellers.seller
	
FROM
(SELECT cur_sales_record_history.id AS 'sale_id', cur_sales_record_history.sale_price, cur_sales_history_contact_mapping.cur_buildings_id AS 'building_id', cur_sales_record_history.property_mgmt_company, cur_sales_record_history.sale_date
FROM cur_sales_history_contact_mapping
INNER JOIN cur_sales_record_history
	ON (cur_sales_history_contact_mapping.cur_sales_record_history_id = cur_sales_record_history.id)
WHERE cur_buildings_id = buildingID
GROUP BY cur_sales_history_contact_mapping.cur_sales_record_history_id) AS tempContactMappingBase

LEFT OUTER JOIN
(SELECT 
cur_sales_history_contact_mapping.cur_sales_record_history_id,
GROUP_CONCAT(DISTINCT cur_contacts.name) AS 'owner'
FROM cur_sales_history_contact_mapping
INNER JOIN ref_contact_type 
	ON (cur_sales_history_contact_mapping.ref_contact_type_id = ref_contact_type.id)
INNER JOIN cur_contacts
	ON (cur_sales_history_contact_mapping.contact_id = cur_contacts.id)
WHERE cur_buildings_id = buildingID 
	AND ref_contact_type.type = 'owner'
GROUP BY	
	cur_sales_history_contact_mapping.cur_sales_record_history_id) AS tempContactMappingOwners
ON (tempContactMappingBase.sale_id = tempContactMappingOwners.cur_sales_record_history_id)

LEFT OUTER JOIN
(SELECT 
cur_sales_history_contact_mapping.cur_sales_record_history_id ,
GROUP_CONCAT(DISTINCT cur_contacts.name) AS 'seller'
FROM cur_sales_history_contact_mapping
INNER JOIN ref_contact_type 
	ON (cur_sales_history_contact_mapping.ref_contact_type_id = ref_contact_type.id)
INNER JOIN cur_contacts
	ON (cur_sales_history_contact_mapping.contact_id = cur_contacts.id)
WHERE cur_buildings_id = buildingID 
	AND ref_contact_type.type = 'seller'
GROUP BY	
	cur_sales_history_contact_mapping.cur_sales_record_history_id) AS tempContactMappingSellers

ON (tempContactMappingBase.sale_id = tempContactMappingSellers.cur_sales_record_history_id);
END$$
DELIMITER ;	
