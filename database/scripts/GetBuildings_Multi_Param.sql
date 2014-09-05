USE cred;
DROP PROCEDURE if EXISTS `GetBuildings` ;
DELIMITER $$
CREATE PROCEDURE `GetBuildings`(IN contactSearchTerms VARCHAR(128), IN addressSearchTerms VARCHAR(128),IN buildingSearchTerms VARCHAR(128),
		IN unitQuantityMin int, IN unitQuantityMax int, IN saleDateRangeStart datetime, IN saleDateRangeEnd datetime,
		IN centerLatitude FLOAT, IN centerLongitude FLOAT, IN boundsLatitudeMin FLOAT, IN boundsLatitudeMax FLOAT, IN boundsLongitudeMin FLOAT, 
		IN boundsLongitudeMax FLOAT,IN hasElevator BOOLEAN, IN capRateMin FLOAT, IN capRateMax FLOAT, 
		IN propMgmt VARCHAR(128), IN prevPropMgmt VARCHAR(128), IN heatAgeMin INT, IN heatAgeMax INT,
		IN boilerAgeMin INT, IN boilerAgeMax INT, IN cableProvider VARCHAR(128),
		IN assessedValueMin INT, IN assessedValueMax INT,IN lastSalesPriceMin INT, IN lastSalesPriceMax INT,
		IN numOf1BedroomMin INT, IN numOf1BedroomMax INT, IN numOf2BedroomMin INT, IN numOf2BedroomMax INT, 
		IN numOf3BedroomMin INT, IN numOf3BedroomMax INT, IN numOfBachelorMin INT, IN numOfBachelorMax INT, 
		IN priceOf1BedroomMin INT, IN priceOf1BedroomMax INT, IN priceOf2BedroomMin INT, IN priceOf2BedroomMax INT, 
		IN priceOf3BedroomMin INT, IN priceOf3BedroomMax INT, IN priceOfBachelorMin INT, IN priceOfBachelorMax INT, 
		IN buildingIncomeMin INT, IN buildingIncomeMax INT, IN unitPriceMin INT, IN unitPriceMax INT,	
		IN windowInstallYearMin INT, IN windowInstallYearMax INT, IN numOfSalesMin INT, numOfSalesMax INT,
		IN buildingTypes VARCHAR(64), IN heatSystemTypes VARCHAR(64),
		IN mortgageCompany VARCHAR(64),IN mortgageDueDateRangeStart datetime, IN mortgageDueDateRangeEnd datetime,
		IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT id int)
BEGIN
SELECT 
	 SQL_CALC_FOUND_ROWS GROUP_CONCAT(owner_contact.name SEPARATOR ', ') as 'owner'
	,cur_address.street_number_begin
	,cur_address.street_number_end
	,cur_address.street_name 
	,cur_address.postal_code
	,cur_address.city
	,cur_buildings.id as 'building_id'
	,cur_buildings.unit_quantity as 'units'
	,cur_buildings.property_mgmt_company 
	,cur_buildings.prev_property_mgmt_company
	,cur_buildings.sale_date
	,cur_address.latitude
	,cur_address.longitude
	,cur_buildings.windows_installed_year
	,IFNULL(sales_count.num_of_records,0) AS num_of_sales
	,ref_building_type.id
	,ref_heat_system_type.id
	
FROM 
	cred.cur_owner_seller_property_mapping as mapping
	LEFT JOIN cred.cur_contacts AS owner_contact on (owner_contact.id = mapping.contact_id AND mapping.contact_type_id = '1')
	INNER JOIN cred.cur_address ON (cur_address.id = mapping.property_address_id)
	INNER JOIN cur_buildings ON (cur_buildings.cur_address_id = cur_address.id)	
	LEFT JOIN ref_building_type ON (ref_building_type.id = cur_buildings.ref_building_type_id)
	LEFT JOIN ref_heat_system_type ON (ref_heat_system_type.id = cur_buildings.heat_system_type_id)
	LEFT JOIN (SELECT COUNT(DISTINCT cur_sales_record_history_id) AS 'num_of_records'
				,cur_buildings_id  
				FROM cur_sales_history_contact_mapping 
				GROUP BY cur_buildings_id) AS sales_count ON (sales_count.cur_buildings_id = cur_buildings.id)
WHERE
	(addressSearchTerms IS NULL OR MATCH(street_name,postal_code,city,province) AGAINST (addressSearchTerms IN BOOLEAN MODE))
	AND (contactSearchTerms IS NULL OR MATCH (owner_contact.name, owner_contact.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
	AND (buildingSearchTerms IS NULL OR MATCH (property_mgmt_company,prev_property_mgmt_company) AGAINST (buildingSearchTerms IN BOOLEAN MODE))
	AND (CASE WHEN unitQuantityMax IS NOT NULL THEN (cur_buildings.unit_quantity <= unitQuantityMax) ELSE 1 END)
	AND (CASE WHEN unitQuantityMin IS NOT NULL THEN (cur_buildings.unit_quantity >= unitQuantityMin) ELSE 1 END)
	AND (CASE WHEN saleDateRangeStart IS NOT NULL THEN (cur_buildings.sale_date >= saleDateRangeStart ) ELSE 1 END)
	AND (CASE WHEN saleDateRangeEnd IS NOT NULL THEN (cur_buildings.sale_date <= saleDateRangeEnd) ELSE 1 END)
	AND (CASE WHEN mortgageDueDateRangeStart IS NOT NULL THEN (cur_buildings.mortage_due_date >= mortgageDueDateRangeStart ) ELSE 1 END)
	AND (CASE WHEN mortgageDueDateRangeEnd IS NOT NULL THEN (cur_buildings.mortage_due_date <= mortgageDueDateRangeEnd) ELSE 1 END)
	AND (CASE WHEN boundsLatitudeMin IS NOT NULL THEN cur_address.latitude BETWEEN boundsLatitudeMin AND boundsLatitudeMax ELSE 1 END)
	AND (CASE WHEN boundsLongitudeMin IS NOT NULL THEN cur_address.longitude BETWEEN boundsLongitudeMin AND boundsLongitudeMax ELSE 1 END)
	AND (CASE WHEN capRateMax IS NOT NULL THEN (cur_buildings.cap_rate <= capRateMax) ELSE 1 END)
	AND (CASE WHEN capRateMin IS NOT NULL THEN (cur_buildings.cap_rate >= capRateMin) ELSE 1 END)
	AND (CASE WHEN heatAgeMax IS NOT NULL THEN (cur_buildings.heat_system_age <= heatAgeMax) ELSE 1 END)
	AND (CASE WHEN heatAgeMin IS NOT NULL THEN (cur_buildings.heat_system_age >= heatAgeMin) ELSE 1 END)
	AND (CASE WHEN boilerAgeMax IS NOT NULL THEN (cur_buildings.boiler_installed_year <= boilerAgeMax) ELSE 1 END)
	AND (CASE WHEN boilerAgeMin IS NOT NULL THEN (cur_buildings.boiler_installed_year >= boilerAgeMin) ELSE 1 END)
	AND (CASE WHEN assessedValueMax IS NOT NULL THEN (cur_buildings.assessed_value <= assessedValueMax) ELSE 1 END)
	AND (CASE WHEN assessedValueMin IS NOT NULL THEN (cur_buildings.assessed_value >= assessedValueMin) ELSE 1 END)
	AND (CASE WHEN numOf1BedroomMax IS NOT NULL THEN (cur_buildings.bedroom1_units <= numOf1BedroomMax) ELSE 1 END)
	AND (CASE WHEN numOf1BedroomMin IS NOT NULL THEN (cur_buildings.bedroom1_units >= numOf1BedroomMin) ELSE 1 END)
	AND (CASE WHEN numOf2BedroomMax IS NOT NULL THEN (cur_buildings.bedroom2_units <= numOf2BedroomMax) ELSE 1 END)
	AND (CASE WHEN numOf2BedroomMin IS NOT NULL THEN (cur_buildings.bedroom2_units >= numOf2BedroomMin) ELSE 1 END)
	AND (CASE WHEN numOf3BedroomMax IS NOT NULL THEN (cur_buildings.bedroom3_units <= numOf3BedroomMax) ELSE 1 END)
	AND (CASE WHEN numOf3BedroomMin IS NOT NULL THEN (cur_buildings.bedroom3_units >= numOf3BedroomMin) ELSE 1 END)
	AND (CASE WHEN numOfBachelorMax IS NOT NULL THEN (cur_buildings.bachelor_units <= numOfBachelorMax) ELSE 1 END)
	AND (CASE WHEN numOfBachelorMin IS NOT NULL THEN (cur_buildings.bachelor_units >= numOfBachelorMin) ELSE 1 END)
	AND (CASE WHEN priceOf1BedroomMax IS NOT NULL THEN (cur_buildings.bedroom1_price <= priceOf1BedroomMax) ELSE 1 END)
	AND (CASE WHEN priceOf1BedroomMin IS NOT NULL THEN (cur_buildings.bedroom1_price >= priceOf1BedroomMin) ELSE 1 END)
	AND (CASE WHEN priceOf2BedroomMax IS NOT NULL THEN (cur_buildings.bedroom2_price <= priceOf2BedroomMax) ELSE 1 END)
	AND (CASE WHEN priceOf2BedroomMin IS NOT NULL THEN (cur_buildings.bedroom2_price >= priceOf2BedroomMin) ELSE 1 END)
	AND (CASE WHEN priceOf3BedroomMax IS NOT NULL THEN (cur_buildings.bedroom3_price <= priceOf3BedroomMax) ELSE 1 END)
	AND (CASE WHEN priceOf3BedroomMin IS NOT NULL THEN (cur_buildings.bedroom3_price >= priceOf3BedroomMin) ELSE 1 END)
	AND (CASE WHEN priceOfBachelorMax IS NOT NULL THEN (cur_buildings.bachelor_price <= priceOfBachelorMax) ELSE 1 END)
	AND (CASE WHEN priceOfBachelorMin IS NOT NULL THEN (cur_buildings.bachelor_price >= priceOfBachelorMin) ELSE 1 END)	
	AND (CASE WHEN buildingIncomeMin IS NOT NULL THEN (cur_buildings.building_income >= buildingIncomeMin) ELSE 1 END)
	AND (CASE WHEN buildingIncomeMax IS NOT NULL THEN (cur_buildings.building_income <= buildingIncomeMax) ELSE 1 END)
	AND (CASE WHEN unitPriceMin IS NOT NULL THEN (cur_buildings.unit_price >= unitPriceMin) ELSE 1 END)
	AND (CASE WHEN unitPriceMax IS NOT NULL THEN (cur_buildings.unit_price <= unitPriceMax) ELSE 1 END)
	AND (CASE WHEN lastSalesPriceMin IS NOT NULL THEN (cur_buildings.last_sale_price >= lastSalesPriceMin) ELSE 1 END)
	AND (CASE WHEN lastSalesPriceMax IS NOT NULL THEN (cur_buildings.last_sale_price <= lastSalesPriceMax) ELSE 1 END)
	AND (CASE WHEN numOfSalesMin IS NOT NULL THEN (sales_count.num_of_records >= numOfSalesMin) ELSE 1 END)
	AND (CASE WHEN numOfSalesMax IS NOT NULL THEN (sales_count.num_of_records <= numOfSalesMax) ELSE 1 END)
	AND (CASE WHEN windowInstallYearMax IS NOT NULL THEN (cur_buildings.windows_installed_year <= windowInstallYearMax) ELSE 1 END)
	AND (CASE WHEN windowInstallYearMin IS NOT NULL THEN (cur_buildings.windows_installed_year >= windowInstallYearMin) ELSE 1 END)
	AND (CASE WHEN hasElevator IS NOT NULL THEN (cur_buildings.has_elevator = hasElevator) ELSE 1 END)
	AND (CASE WHEN propMgmt IS NOT NULL THEN (cur_buildings.property_mgmt_company = propMgmt) ELSE 1 END)
	AND (CASE WHEN prevPropMgmt IS NOT NULL THEN (cur_buildings.prev_property_mgmt_company = prevPropMgmt) ELSE 1 END)
	AND (CASE WHEN cableProvider IS NOT NULL THEN (cur_buildings.cable_internet_provider = cableProvider) ELSE 1 END)
	AND (CASE WHEN mortgageCompany IS NOT NULL THEN (cur_buildings.mortgage_company = mortgageCompany) ELSE 1 END)
	AND (CASE WHEN buildingTypes IS NOT NULL THEN FIND_IN_SET(ref_building_type.id, buildingTYpes) ELSE 1 END)
	AND (CASE WHEN heatSystemTypes IS NOT NULL THEN FIND_IN_SET(ref_heat_system_type.id, heatSystemTypes) ELSE 1 END)
	AND (cur_buildings.is_deleted = 0)
GROUP BY 
	cur_address.id
ORDER BY
	CASE WHEN orderBy='owner_asc' THEN name END ASC,
	CASE WHEN orderBy='owner_desc' THEN name END DESC,
	CASE WHEN orderBy='street_number_begin_asc' THEN street_number_begin END ASC,
	CASE WHEN orderBy='street_number_begin_desc' THEN street_number_begin END DESC,
	CASE WHEN orderBy='street_number_end_asc' THEN street_number_end END ASC,
	CASE WHEN orderBy='street_number_end_desc' THEN street_number_end END DESC,
	CASE WHEN orderBy='street_name_asc' THEN street_name END ASC,
	CASE WHEN orderBy='street_name_desc' THEN street_name END DESC,
	CASE WHEN orderBy='postal_code_asc' THEN postal_code END ASC,
	CASE WHEN orderBy='postal_code_desc' THEN postal_code END DESC,
	CASE WHEN orderBy='city_asc' THEN city END ASC,
	CASE WHEN orderBy='city_desc' THEN city END DESC,
	CASE WHEN orderBy='units_asc' THEN units END ASC,
	CASE WHEN orderBy='units_desc' THEN units END DESC,
	CASE WHEN orderBy='sale_date_asc' THEN sale_date END ASC,
	CASE WHEN orderBy='sale_date_desc' THEN sale_date END DESC,
	CASE WHEN orderBy='longitude_asc' THEN longitude END ASC,
	CASE WHEN orderBy='longitude_desc' THEN longitude END DESC,
	CASE WHEN orderBy='latitude_asc' THEN latitude END ASC,
	CASE WHEN orderBy='latitude_desc' THEN latitude END DESC
LIMIT recordCount OFFSET offsetIndex;

SET id = FOUND_ROWS();

END$$
DELIMITER ;



