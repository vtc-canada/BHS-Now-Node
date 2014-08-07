USE cred;
DROP PROCEDURE if EXISTS `DeleteBuilding` ;

DELIMITER $$
CREATE PROCEDURE `DeleteBuilding`(IN buildingID INT)
BEGIN
		UPDATE cur_buildings
			SET is_deleted = 1
		WHERE id = buildingID;
END$$
DELIMITER ;