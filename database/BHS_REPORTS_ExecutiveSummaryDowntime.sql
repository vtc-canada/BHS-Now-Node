
DROP procedure IF EXISTS `BHS_REPORTS_ExecutiveSummaryDowntime`;

DELIMITER $$
CREATE PROCEDURE `BHS_REPORTS_ExecutiveSummaryDowntime`(IN `startTime` DATETIME,
		IN `endTime` DATETIME,
		OUT `locale` VARCHAR(512)
	)
BEGIN
	SELECT	
		COALESCE((SUM(CASE WHEN cfg_tag_id.alarm_type IN (11,12)  THEN  IF (timeoff>timeon, TIME_TO_SEC(TIMEDIFF(timeoff,timeon)), TIME_TO_SEC(TIMEDIFF(UTC_TIMESTAMP(),timeon)))END)),0)  AS 'jams_downtime'
		,COALESCE((SUM(CASE WHEN cfg_tag_id.alarm_type IN (13,14)  THEN  IF (timeoff>timeon, TIME_TO_SEC(TIMEDIFF(timeoff,timeon)), TIME_TO_SEC(TIMEDIFF(UTC_TIMESTAMP(),timeon)))END)),0)  AS 'estop_downtime'
		,COALESCE((SUM(CASE WHEN cfg_tag_id.alarm_type IN (1,2,3) THEN  IF (timeoff>timeon, TIME_TO_SEC(TIMEDIFF(timeoff,timeon)), TIME_TO_SEC(TIMEDIFF(UTC_TIMESTAMP(),timeon)))END)),0) AS 'motor_faults_downtime'
		,COALESCE((SUM(CASE WHEN cfg_tag_id.alarm_type IN (5)  THEN IF (timeoff>timeon, TIME_TO_SEC(TIMEDIFF(timeoff,timeon)), TIME_TO_SEC(TIMEDIFF(UTC_TIMESTAMP(),timeon)))END)),0) AS 'motor_disconnect downtime'
		,COALESCE((SUM(CASE WHEN cfg_tag_id.alarm_type IN (1,2,3,5,11,12,13,14)  THEN IF (timeoff>timeon, TIME_TO_SEC(TIMEDIFF(timeoff,timeon)), TIME_TO_SEC(TIMEDIFF(UTC_TIMESTAMP(),timeon)))END)),0) AS 'system_downtime'
		, 
IF (((TIME_TO_SEC(TIMEDIFF( IF(endTime>UTC_TIMESTAMP(),UTC_TIMESTAMP(),endTime),startTime)) - 
			(SUM(CASE WHEN cfg_tag_id.alarm_type IN (1,2,3,5,11,12,13,14)  
				THEN IF (timeoff>timeon, TIME_TO_SEC(TIMEDIFF(timeoff,timeon)), 
				TIME_TO_SEC(TIMEDIFF(IF(endTime>UTC_TIMESTAMP(),UTC_TIMESTAMP(),endTime),timeon)))END))
			) 
<<<<<<< HEAD
			/ TIME_TO_SEC(TIMEDIFF(NOW(),startTime))) * 100 AS 'system_availablity'  #Time elapsed in Day minus system_downtime divided by Time in Day
=======
			/ TIME_TO_SEC(TIMEDIFF(IF(endTime>UTC_TIMESTAMP(),UTC_TIMESTAMP(),endTime),startTime))) IS NULL, 100,
((TIME_TO_SEC(TIMEDIFF( IF(endTime>UTC_TIMESTAMP(),UTC_TIMESTAMP(),endTime),startTime)) - 
			(SUM(CASE WHEN cfg_tag_id.alarm_type IN (1,2,3,5,11,12,13,14)  
				THEN IF (timeoff>timeon, TIME_TO_SEC(TIMEDIFF(timeoff,timeon)), 
				TIME_TO_SEC(TIMEDIFF(IF(endTime>UTC_TIMESTAMP(),UTC_TIMESTAMP(),endTime),timeon)))END))
			) 
			/ TIME_TO_SEC(TIMEDIFF(IF(endTime>UTC_TIMESTAMP(),UTC_TIMESTAMP(),endTime),startTime))) * 100) AS 'system_availability'  #Time elapsed in Day minus system_downtime divided by Time in Day
#)
>>>>>>> 41a8c0a... styling fixes, downtime sproc fix.\
	FROM cur_alarm_history
	INNER JOIN cfg_tag_id ON (cfg_tag_id.id = cur_alarm_history.tag_ID
				AND cur_alarm_history.timeon > startTime);

	SET locale = '{"columns":[
			{"locale":{"en":"Jams Downtime","es":"Jams Downtime"}},
			{"locale":{"en":"E-Stop Downtime","es":"E-Stop Downtime"}},
			{"locale":{"en":"Motor Faults Downtime","es":"Motor Faults Downtime"}},
			{"locale":{"en":"Motor Disconnect Downtime","es":"Motor Disconnect Downtime"}},
			{"locale":{"en":"System Downtime","es":"System Downtime"},
			{"locale":{"en":"System Availabilty","es":"System Availabilty"},"modifier":"secondsString"}
			]}';

END$$

DELIMITER ;

