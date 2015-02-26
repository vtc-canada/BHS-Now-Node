
DROP PROCEDURE if EXISTS `DeleteAirplane` ;

DELIMITER $$
CREATE PROCEDURE `DeleteAirplane`(IN airplaneID INT)
BEGIN
		UPDATE cur_airplanes\	
			SET is_deleted = 1,
			serial_number = CONCAT(CONCAT(serial_number, '_DELETED_'),NOW())
		WHERE id = airplaneID;
END$$
DELIMITER ;

