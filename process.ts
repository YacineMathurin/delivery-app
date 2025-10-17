/* Each command should have these props */
type Command = {
    commandId: number,
    companyId: number,
    emitterId: number;
    emitterPhoneNumber: number
    receiverId: number,
    /** Deliverer should reconfirm this number as a secret will be sent to it */
    receiverPhoneNumber: number,
    /** Stores users coordinates */
    trace: Object,
    /** secret is sent to the receiver only and is used to auth receiver of the package */
    secret: number,
    completed: boolean,
    /** Stores the id of deleverers that declined the command */
    excluded: Object[],
    /** Date used in the daily dashbord */
    createdAt: Date,
    updatedAt: Date,
}

type Deliverer = {
    companyId: number,
    id: number,
    username: string,
    password: string,
    vehiculeType: string,
    position: Object,
    status: boolean,
    avail: boolean,
    prio: number
}

type Company = {
    companyId: number,
    blocked: boolean,
    name: string,
    description: string,
    username: string,
    password: string
}

/** 
 * On separate deliv. app, update its position each X-minutes
 */

/* 
* We open a pop up to ask user to confirm his command details

    Once command confirmed tell sender that you will come to him with avail. deliverers
    Send proposition to see if deliverer with coresponding vehicule type, within 5km is online and accept it in a radius of Y-km
    First click(s) got the pre-selection, others see kind message of command already picked by another, stay focus for next opportinuity
    Once got 1 or 3 accepts (depends on chosen concept), go back to the sender to pick his deliv.
    If (sender declined del.)
        dispatch to others dels, exclude last one(s)
        Tell last one that sender pick someone else
    Else
        OK, all set
*/

/** Once arrived deliverers ask receiver to enter secret on the app so to confirm all is OK and complete command */

/* Track deliverer (v2 probably)
* From the first page user can have ongoing delivery and option to track
*/