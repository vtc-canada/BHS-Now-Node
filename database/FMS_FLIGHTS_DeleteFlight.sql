DROP procedure IF EXISTS `FMS_FLIGHTS_DeleteFlight`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_DeleteFlight` (IN paramFlight_ID INT)
BEGIN
DELETE FROM cur_flights 
WHERE id = paramFlight_ID;
END$$

DELIMITER ;
