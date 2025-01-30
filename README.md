# journalarm
PWA idea for mental health self-advocacy app


Hopefully a PWA alarm and journaling app for medicine, supplements, and mental health self-advocacy.

Goal:  
A local-only file that a user can put on their phone or computer desktop
that supports medication compliance as well as journaling to aid with
thought expression, memory (hallmark and recall), and establishing a
baseline of prose for that user.  

Alarm functionality: 
Functions like an alarm app. Should store data encrypted in indexedDB (or similar);
user should be able to set alarms for work week or full week, up to 5 alarms.
A user should be able to temporarily disable - "off" an alarm;
as well as remove an alarm.

Journal functionality:
User may create a new journal entry, or read-only view previous entries.
simple text box input, no styling supported but utf-8 ideally so user can
use emoji or emoticons or kanji or whatever they want to express themselves.

Journalarm will not be considered complete until the user can export their data
from indexedDB at least as CSV. The user should be able to export either
data set, or both, in any order.

<edit this please> the csv should include a header of the fields for each export  
For each alarm: a row should be emitted with the date and time of the historical alarm
as well as what the user action was, if any. Either the user missed the alarm - 
no action, or the user actively pressed "took medicine".  
For each journal entry: A row should be emitted with the date and at least 
rough time of the historical entry


