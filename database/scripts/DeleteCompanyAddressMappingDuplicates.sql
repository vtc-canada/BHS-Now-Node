USE cred;
DROP PROCEDURE if EXISTS `DeleteCompanyAddressMappingDuplicates` ;

DELIMITER $$
CREATE PROCEDURE `DeleteCompanyAddressMappingDuplicates`()
BEGIN
	DELETE t1
	FROM cur_company_address_mapping AS t1
	INNER JOIN cur_company_address_mapping AS t2 ON (t1.cur_address_id = t2.cur_address_id
		AND t1.cur_company_id = t2.cur_company_id
		AND t1.cur_contacts_id = t2.cur_contacts_id) 
	WHERE t1.id > t2.id;
END$$
DELIMITER ;