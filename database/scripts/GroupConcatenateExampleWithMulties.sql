	SELECT 
		 SQL_CALC_FOUND_ROWS GROUP_CONCAT(DISTINCT owner_contact.name SEPARATOR ', ') as 'owner'
		,cur_address.street_number_begin
		,cur_address.street_number_end
		,cur_address.street_name 
		,mapping.id as 'mapping'
		,GROUP_CONCAT(DISTINCT cur_phone_numbers.phone_number SEPARATOR ', ') as 'number'
		,mapping.property_address_id
	FROM 
		cred.cur_owner_seller_property_mapping as mapping
		LEFT JOIN cred.cur_contacts as owner_contact on (owner_contact.id = mapping.owner_contact_id)
		INNER JOIN cred.cur_address on (cur_address.id = mapping.property_address_id)
		INNER JOIN cur_buildings ON (cur_buildings.cur_address_id = cur_address.id)	
		LEFT JOIN cur_phone_numbers ON (owner_contact.id = cur_phone_numbers.contact_ID)
	WHERE mapping.id = 25 or mapping.id = 7011
		
	GROUP BY 
		mapping.property_address_id