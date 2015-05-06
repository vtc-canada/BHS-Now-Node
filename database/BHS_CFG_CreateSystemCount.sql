DROP procedure IF EXISTS `BHS_CFG_CreateSystemCount`;

DELIMITER $$

CREATE PROCEDURE `BHS_CFG_CreateSystemCount`(IN countID INT,IN tagID INT, IN countName VARCHAR(128)
					,IN tagName VARCHAR(128),IN tagAddress VARCHAR(128),IN countsGroup INT, IN countType INT)
#Example
#countID = 1012
#tagID = 148
#countName = TC1 Throughput Count
#tagName = S_MU1_TP_CNT
#tagAddress = S_THROUGHPUT[0]
#countsGroup = 1
#countsType = 3
#CALL BHS_CFG_CreateSystemCount(1012,148,'TC1 Throughput Count', 'S_MU1_TP_CNT', 'S_THROUGHPUT[0]', 1, 3);
BEGIN
	INSERT INTO cfg_count_id (id, name, counts_group, type) VALUES (countID,countName, countsGroup, countType);
	INSERT INTO cur_counts (id, value) VALUES (countID, 0);
	INSERT INTO cur_reg_counts (id,prev_value,current_value,delta_value) VALUES (countID,0,0,0);
	INSERT INTO cfg_tag_id (id, name, eqp_ID, count_ID, plc_ID, tag_address) VALUES (tagID,tagName,null, countID, 1, tagAddress);
	INSERT INTO cur_tags (id, value) VALUES (tagID, 0);
	
END $$
DELIMITER ;

