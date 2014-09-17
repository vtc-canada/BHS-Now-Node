USE cred;
DROP PROCEDURE if EXISTS `SearchNotes` ;

DELIMITER $$
CREATE PROCEDURE `SearchNotes`(IN noteSearchTerms VARCHAR(128), IN user VARCHAR(128), IN startDate TIMESTAMP, IN endDate TIMESTAMP
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255),OUT filteredCount INT,OUT totalCount INT)
BEGIN
		SELECT
			SQL_CALC_FOUND_ROWS 
			cur_notes.id as 'note_id'
			,cur_notes.note
			,cur_notes.user
			,cur_notes.timestamp
			,GROUP_CONCAT(DISTINCT cur_contacts.id SEPARATOR ', ') as 'contact_id'
			,GROUP_CONCAT(DISTINCT cur_contacts.name SEPARATOR ', ') as 'contact'
			,GROUP_CONCAT(DISTINCT cur_company.name SEPARATOR ', ') as 'company'
			,GROUP_CONCAT(DISTINCT cur_company.id SEPARATOR ', ') as 'company_id'
			,GROUP_CONCAT(DISTINCT cur_address.id SEPARATOR ', ') as 'cur_address_id'
			,GROUP_CONCAT(DISTINCT cur_address.street_number_begin SEPARATOR ', ') as 'street_number_begin'
			,GROUP_CONCAT(DISTINCT cur_address.street_number_end SEPARATOR ', ') as 'street_number_end'
			,GROUP_CONCAT(DISTINCT cur_address.street_name SEPARATOR ', ') as 'street_name'
			,GROUP_CONCAT(DISTINCT cur_address.city SEPARATOR ', ') as 'city'
			,GROUP_CONCAT(DISTINCT cur_address.province SEPARATOR ', ') as 'province'
			,GROUP_CONCAT(DISTINCT cur_address.postal_code SEPARATOR ', ') as 'postal_code' 
		FROM 
			cur_notes
			INNER JOIN cur_note_mapping  as contact_mapping ON (contact_mapping.cur_notes_id = cur_notes.id)
			LEFT JOIN cur_contacts ON (contact_mapping.entity_id = cur_contacts.id AND contact_mapping.ref_entity_type_id = 1) #Contact Type
			LEFT JOIN cur_note_mapping  as company_mapping ON (company_mapping.cur_notes_id = cur_notes.id)
			LEFT JOIN cur_company ON (company_mapping.entity_id = cur_company.id AND company_mapping.ref_entity_type_id = 2) #Company Type
			LEFT JOIN cur_note_mapping  as address_mapping ON (address_mapping.cur_notes_id = cur_notes.id)
			LEFT JOIN cur_address ON (cur_address.id = address_mapping.entity_id AND address_mapping.ref_entity_type_id = 3) #Property Type
			LEFT JOIN cur_buildings ON (cur_buildings.cur_address_id = cur_address.id)
		WHERE
			(noteSearchTerms IS NULL OR MATCH(note) AGAINST (noteSearchTerms IN BOOLEAN MODE))	
			AND cur_notes.is_deleted = 0
			AND (startDate IS NULL OR cur_notes.timestamp >= startDate)
			AND (endDate IS NULL OR cur_notes.timestamp <= endDate)
			AND (user IS NULL OR (cur_notes.user LIKE CONCAT('%',user,'%')))
			AND (CASE WHEN cur_company.id IS NOT NULL THEN cur_company.is_deleted = 0 ELSE 1 END)
			AND (CASE WHEN cur_contacts.id IS NOT NULL THEN cur_contacts.is_deleted = 0 ELSE 1 END)
			AND (CASE WHEN cur_buildings.id IS NOT NULL THEN cur_buildings.is_deleted = 0 ELSE 1 END)
		GROUP BY cur_notes.id	
	ORDER BY 
			CASE WHEN orderBy='note_asc' THEN note END ASC,
			CASE WHEN orderBy='note_desc' THEN note END DESC,
			CASE WHEN orderBy='user_asc' THEN user END ASC,
			CASE WHEN orderBy='user_desc' THEN user END DESC,
			CASE WHEN orderBy='timestamp_asc' THEN timestamp END ASC,
			CASE WHEN orderBy='timestamp_desc' THEN timestamp END DESC,
			CASE WHEN orderBy='contact_asc' THEN cur_contacts.name END ASC,
			CASE WHEN orderBy='contact_desc' THEN cur_contacts.name  END DESC,
			CASE WHEN orderBy='company_asc' THEN cur_company.name  END ASC,
			CASE WHEN orderBy='company_desc' THEN cur_company.name  END DESC,
			CASE WHEN orderBy='street_number_begin_asc' THEN street_number_begin END ASC,
			CASE WHEN orderBy='street_number_begin_desc' THEN street_number_begin END DESC,
			CASE WHEN orderBy='city_asc' THEN city END ASC,
			CASE WHEN orderBy='city_desc' THEN city END DESC,
			CASE WHEN orderBy='province_asc' THEN province END ASC,
			CASE WHEN orderBy='province_desc' THEN province END DESC,
			CASE WHEN orderBy='postal_code_asc' THEN postal_code END ASC,
			CASE WHEN orderBy='postal_code_desc' THEN postal_code END DESC

	LIMIT recordCount OFFSET offsetIndex;
	SET filteredCount = FOUND_ROWS();

	#Find Total unfiltered rows - this is trickier, because a company, contact, building, mapping, note could be deleted
	#in all possible combinations
	SELECT COUNT(*) INTO totalCount FROM (
	SELECT cur_notes.id
	FROM cur_notes
		INNER JOIN cur_note_mapping  as contact_mapping ON (contact_mapping.cur_notes_id = cur_notes.id)
			LEFT JOIN cur_contacts ON (contact_mapping.entity_id = cur_contacts.id AND contact_mapping.ref_entity_type_id = 1) #Contact Type
			LEFT JOIN cur_note_mapping  as company_mapping ON (company_mapping.cur_notes_id = cur_notes.id)
			LEFT JOIN cur_company ON (company_mapping.entity_id = cur_company.id AND company_mapping.ref_entity_type_id = 2) #Company Type
			LEFT JOIN cur_note_mapping  as address_mapping ON (address_mapping.cur_notes_id = cur_notes.id)
			LEFT JOIN cur_address ON (cur_address.id = address_mapping.entity_id AND address_mapping.ref_entity_type_id = 3) #Property Type
			LEFT JOIN cur_buildings ON (cur_buildings.cur_address_id = cur_address.id)
		WHERE
			cur_notes.is_deleted = 0
			AND (CASE WHEN cur_company.id IS NOT NULL THEN cur_company.is_deleted = 0 ELSE 1 END)
			AND (CASE WHEN cur_contacts.id IS NOT NULL THEN cur_contacts.is_deleted = 0 ELSE 1 END)
			AND (CASE WHEN cur_buildings.id IS NOT NULL THEN cur_buildings.is_deleted = 0 ELSE 1 END)
		GROUP BY contact_mapping.cur_notes_id ) AS Notes;
END$$
DELIMITER ;