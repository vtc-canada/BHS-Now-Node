DROP PROCEDURE if EXISTS `SearchManifests` ;

DELIMITER $$
CREATE PROCEDURE `SearchManifests`(IN manifestSearchTerms VARCHAR(128)
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT filteredCount INT)
BEGIN
	SELECT
		cur_manifest.id
		,cur_manifest.manifest_id
		,cur_manifest.flight_no
		,cur_manifest.regn_no
		,cur_manifest.max_resource_payload
		,cur_manifest.max_leg_payload
		,cur_manifest.route
	FROM cur_manifest
WHERE
((manifestSearchTerms IS NULL OR MATCH (cur_manifest.manifest_id,cur_manifest.flight_no, cur_manifest.regn_no, 
		cur_manifest.max_resource_payload,cur_manifest.max_leg_payload,cur_manifest.route)
	AGAINST (manifestSearchTerms IN BOOLEAN MODE)))

/*ORDER BY
	CASE WHEN orderBy='contact_name_asc' THEN contact_name END ASC,
	CASE WHEN orderBy='contact_name_desc' THEN contact_name END DESC,
	CASE WHEN orderBy='company_asc' THEN cur_company.name END ASC,
	CASE WHEN orderBy='company_desc' THEN cur_company.name  END DESC,
	CASE WHEN orderBy='phone_asc' THEN cur_contacts.phone_number END ASC,
	CASE WHEN orderBy='phone_desc' THEN cur_contacts.phone_number END DESC,
	CASE WHEN orderBy='email_asc' THEN email END ASC,
	CASE WHEN orderBy='email_desc' THEN email END DESC,
	CASE WHEN orderBy='' THEN contact_name END ASC */
	LIMIT recordCount OFFSET offsetIndex;
	SET filteredCount = FOUND_ROWS();
END$$
DELIMITER ;