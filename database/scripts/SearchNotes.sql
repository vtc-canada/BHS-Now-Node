USE cred;
DROP PROCEDURE if EXISTS `SearchNotes` ;

DELIMITER $$
CREATE PROCEDURE `SearchNotes`(IN contactSearchTerms VARCHAR(128), IN addressSearchTerms VARCHAR(128), IN companySearchTerms VARCHAR(128)
							,IN noteSearchTerms VARCHAR(128), IN startDate TIMESTAMP, IN endDate TIMESTAMP
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255),OUT filteredCount INT,OUT totalCount INT)
BEGIN
	DROP TABLE IF EXISTS tmp_notes;
	CREATE TEMPORARY TABLE tmp_notes (
		note_id SMALLINT(5) UNSIGNED,
		note VARCHAR(256),
		user VARCHAR(256),
		timestamp timestamp,
		contact_id SMALLINT(5) UNSIGNED,
		contact VARCHAR(256),
		company VARCHAR(256),
		company_id SMALLINT(5) UNSIGNED,
		street_number_begin VARCHAR(64),
		street_number_end VARCHAR(64),
		street_name VARCHAR(128),
		city VARCHAR(128),
		province VARCHAR(64),
		postal_code VARCHAR(64),
		cur_address_id SMALLINT(5) UNSIGNED,
		KEY(note_id, contact_id, company_id, cur_address_id)
	);
	INSERT INTO tmp_notes (note_id,note,user,timestamp,contact_id,contact,company,company_id,cur_address_id, street_number_begin
		,street_number_end, street_name, city, province, postal_code)
		SELECT 
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
			INNER JOIN cur_note_mapping ON (cur_note_mapping.cur_notes_id = cur_notes.id)
			LEFT JOIN cur_contacts ON (cur_note_mapping.entity_id = cur_contacts.id AND cur_note_mapping.ref_entity_type_id = 1) #Contact Type
			LEFT JOIN cur_company ON (cur_note_mapping.entity_id = cur_company.id AND cur_note_mapping.ref_entity_type_id = 2) #Company Type
			LEFT JOIN cur_address ON (cur_address.id = cur_note_mapping.entity_id AND cur_note_mapping.ref_entity_type_id = 3) #Property Type
			LEFT JOIN cur_buildings ON (cur_buildings.cur_address_id = cur_address.id)
		WHERE
			(noteSearchTerms IS NULL OR MATCH(note) AGAINST (noteSearchTerms IN BOOLEAN MODE))
			AND (startDate IS NULL OR cur_notes.timestamp >= startDate)
			AND (endDate IS NULL OR cur_notes.timestamp <= endDate)
		GROUP BY cur_notes.id;

	#Create Temporary Contacts Table
	DROP TABLE IF EXISTS tmp_contacts;
	CREATE TEMPORARY TABLE tmp_contacts (
		id SMALLINT(5) UNSIGNED,
		KEY(id)
	);
	INSERT INTO tmp_contacts (id)
			SELECT cur_contacts.id
			FROM cur_contacts 
			WHERE (contactSearchTerms IS NULL OR MATCH (cur_contacts.name, cur_contacts.email) AGAINST (contactSearchTerms IN BOOLEAN MODE));
	
	#Create Temporary Company Table
	DROP TABLE IF EXISTS tmp_company;
	CREATE TEMPORARY TABLE tmp_company (
		id SMALLINT(5) UNSIGNED,
		name VARCHAR(128),
		KEY(id)
	);
	INSERT INTO tmp_company (id, name)
			SELECT cur_company.id, cur_company.name
			FROM cur_company 
			WHERE (companySearchTerms IS NULL OR MATCH (cur_company.name) AGAINST (companySearchTerms IN BOOLEAN MODE));
	
	#Create Temporary Address Table
	DROP TABLE IF EXISTS tmp_address;
	CREATE TEMPORARY TABLE tmp_address (
		id SMALLINT(5) UNSIGNED,
		street_name VARCHAR(128),
		KEY(id)
	);
	INSERT INTO tmp_address (id, street_name)
			SELECT cur_address.id, cur_address.street_name
			FROM cur_address 
			WHERE (addressSearchTerms IS NULL OR MATCH(cur_address.street_name,cur_address.postal_code,cur_address.city,cur_address.province) AGAINST (addressSearchTerms IN BOOLEAN MODE));
	
	#Building Final Results
	Select SQL_CALC_FOUND_ROWS 
			tmp_notes.note_id
			,tmp_notes.note
			,tmp_notes.user
			,tmp_notes.timestamp
			,tmp_notes.contact 
			,tmp_notes.company  
			,tmp_notes.street_number_begin 
			,tmp_notes.street_number_end 
			,tmp_notes.street_name 
			,tmp_notes.city  
			,tmp_notes.province  
			,tmp_notes.postal_code  
	FROM tmp_notes
		INNER JOIN tmp_contacts ON (tmp_contacts.id = tmp_notes.contact_id)
		INNER JOIN tmp_company ON (tmp_company.id = tmp_notes.company_id)
		INNER JOIN tmp_address ON (tmp_address.id = tmp_notes.cur_address_id)
	ORDER BY 
			CASE WHEN orderBy='note_asc' THEN note END ASC,
			CASE WHEN orderBy='note_desc' THEN note END DESC,
			CASE WHEN orderBy='user_asc' THEN user END ASC,
			CASE WHEN orderBy='user_desc' THEN user END DESC,
			CASE WHEN orderBy='timestamp_asc' THEN timestamp END ASC,
			CASE WHEN orderBy='timestamp_desc' THEN timestamp END DESC,
			CASE WHEN orderBy='contact_asc' THEN contact END ASC,
			CASE WHEN orderBy='contact_desc' THEN contact END DESC,
			CASE WHEN orderBy='company_asc' THEN company END ASC,
			CASE WHEN orderBy='company_desc' THEN company END DESC,
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

	SELECT COUNT(*) as 'totalCount' INTO totalCount
	FROM cur_notes
	WHERE 
		cur_notes.is_deleted = 0;
END$$
DELIMITER ;