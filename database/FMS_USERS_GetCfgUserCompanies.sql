DROP procedure IF EXISTS `FMS_USERS_GetCfgUserCompanies`;

DELIMITER $$
CREATE PROCEDURE `FMS_USERS_GetCfgUserCompanies` (IN paramUser_ID INT)
BEGIN
	SELECT
cur_company.id
,cur_company.name
,IF(cur_user_company_mapping.id IS NULL,0,1) AS assigned
	FROM
cur_company
LEFT OUTER JOIN cur_user_company_mapping
ON (cur_user_company_mapping.company_ID = cur_company.id AND cur_user_company_mapping.user_ID = paramUser_ID)
WHERE cur_company.is_deleted = 0;
END$$
DELIMITER ;

