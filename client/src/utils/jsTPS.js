
export class jsTPS_Transaction {
    constructor() {};
    doTransaction() {};
    undoTransaction () {};
}
/*  Handles list name changes, or any other top level details of a todolist that may be added   */
export class UpdateRegionSheet_Transaction extends jsTPS_Transaction{
    constructor(_id, regionId, field, prev, update, callback, temp){
        super();
        this.prev = prev;
        this.update = update;
        this.field = field;
        this._id = _id;
        this.regionId=regionId;
        this.updateFunction = callback;
        this.temp = temp;
    }
    async doTransaction() {
		const { data } = await this.updateFunction({ variables: { _id: this._id, regionId:this.regionId, field: this.field, value: this.update }, refetchQueries: this.temp});
		return data;
    }
    async undoTransaction() {
        const { data } = await this.updateFunction({ variables: { _id: this._id, regionId:this.regionId, field: this.field, value: this.prev }, refetchQueries: this.temp});
		return data;
    }
}

export class SortRegion_Transaction extends jsTPS_Transaction{
    constructor(mapId, criteria, increasing, callback, temp) {
        super();
        this.mapId = mapId;
        this.criteria = criteria;
        this.increasing = increasing;
        this.updateFunction = callback;
        this.temp = temp;
    }
    async doTransaction() {
		const { data } = await this.updateFunction({ variables: { _id: this.mapId, criteria:this.criteria, increasing: this.increasing }, refetchQueries: this.temp});
        return data;
    }

    async undoTransaction() {
		const { data } = await this.updateFunction({ variables: { _id: this.mapId, criteria:this.criteria, increasing: !this.increasing }, refetchQueries: this.temp});
        return data;

    }
}

export class AddRegion_Transaction extends jsTPS_Transaction{
    constructor(_id, region, addFunc, deleteFunc, temp){
        super();
        this._id = _id;
        this.region=region;
        // this.index = index;
        this.regionId = "";
        this.addFunction = addFunc;
        this.deleteFunction= deleteFunc;
        this.temp=temp;
    }
    async doTransaction() {
		const { data } = await this.addFunction({ variables: { _id: this._id, region:this.region, index: -1 }, refetchQueries: this.temp});
        this.regionId = data.addRegion;
		// console.log(data, this.regionId)
        return data;
    }
    async undoTransaction() {
        const { data } = await this.deleteFunction({ variables: { _id: this._id, regionId:this.regionId }, refetchQueries: this.temp});
		return data;
    }
}

export class DeleteRegion_Transaction extends jsTPS_Transaction{
    constructor(_id, regionId, index, addFunc, deleteFunc, temp, region){
        super();
        this._id = _id;
        this.regionId=regionId;
        this.index = index
        this.addFunction = addFunc;
        this.deleteFunction= deleteFunc;
        this.region = region;
        this.temp=temp;
    }
    async doTransaction() {
		const { data } = await this.deleteFunction({ variables: { _id: this._id, regionId:this.regionId}, refetchQueries: this.temp});
        // this.region= data.deleteSheetRegion;
        // console.log(this.region)
        return data;
    }

    async undoTransaction() {
        let nRegion = {
			_id : this.region._id,
			name: this.region.name,
			capital: this.region.capital,
			leader: this.region.leader,
            flag: this.region.flag,
            landmarks: this.region.landmarks
		}

		const { data } = await this.addFunction({ variables: { _id: this._id, region:nRegion, index: this.index }, refetchQueries: this.temp});
        return data;

    }
}

export class ChangeParent_Transaction extends jsTPS_Transaction{
    constructor(originalParent, newParent, regionId, index, redo, parentObject, oldParentObject){
        super();
        this.originalParent = originalParent;
        this.newParent=newParent;
        // this.index = index;
        this.regionId = regionId;
        this.index = index;
        this.func= redo;
        this.parentObject=parentObject;
        this.oldParentObject = oldParentObject
        console.log("hhh", oldParentObject)
    }
    async doTransaction() {
		this.func(this.originalParent, this.newParent, this.regionId, -1, this.parentObject)
    }
    async undoTransaction() {
        this.func(this.newParent, this.originalParent, this.regionId, this.index, this.oldParentObject)
    }
}

export class jsTPS {
    constructor() {
        // THE TRANSACTION STACK
        this.transactions = [];
        // KEEPS TRACK OF WHERE WE ARE IN THE STACK, THUS AFFECTING WHAT
        // TRANSACTION MAY BE DONE OR UNDONE AT ANY GIVEN TIME
        this.mostRecentTransaction = -1;
        // THESE VARIABLES CAN BE TURNED ON AND OFF TO SIGNAL THAT
        // DO AND UNDO OPERATIONS ARE BEING PERFORMED
        this.performingDo = false;
        this.performingUndo = false;
    }
    
    /**
     * Tests to see if the do (i.e. redo) operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * return true if the do (i.e. redo) operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingDo() {
        return this.performingDo;
    }
    
    /**
     * Tests to see if the undo operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * return true if the undo operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingUndo() {
        return this.performingUndo;
    }
    
    /**
     * This function adds the transaction argument to the top of
     * the transaction processing system stack and then executes it. Note that it does
     * When this method has completed transaction will be at the top 
     * of the stack, it will have been completed, and the counter have
     * been moved accordingly.
     * 
     * param transaction The custom transaction to be added to
     * the transaction processing system stack and executed.
     */
    addTransaction(transaction) {
        // ARE THERE OLD UNDONE TRANSACTIONS ON THE STACK THAT FIRST
        // NEED TO BE CLEARED OUT, i.e. ARE WE BRANCHING?
        if ((this.mostRecentTransaction < 0)|| (this.mostRecentTransaction < (this.transactions.length-1))) {
            for (let i = this.transactions.length-1; i > this.mostRecentTransaction; i--) {
                this.transactions.splice(i, 1);
            }
        }

        // AND NOW ADD THE TRANSACTION
        this.transactions.push(transaction);
        // AND EXECUTE IT
        // this.doTransaction();        
    }

    /**
     * This function executes the transaction at the location of the counter,
     * then moving the TPS counter. Note that this may be the transaction
     * at the top of the TPS stack or somewhere in the middle (i.e. a redo).
     */
     async doTransaction() {
		let retVal;
        if(this.isPerformingDo() || this.isPerformingUndo()) return;
        if (this.hasTransactionToRedo() ) {   
            this.performingDo = true;
            let transaction = this.transactions[this.mostRecentTransaction+1];
			retVal = await transaction.doTransaction();
			this.mostRecentTransaction++;
			this.performingDo = false;
            
        }
        console.log('transactions: ' + this.getSize());
        console.log('redo transactions:' + this.getRedoSize());
        console.log('undo transactions:' + this.getUndoSize());
		console.log(this.mostRecentTransaction)
		console.log(' ')
		return retVal;
    }
    
    /**
     * This function checks to see if there is a transaction to undo. If there
     * is it will return it, if not, it will return null.
     * 
     * return The transaction that would be executed if undo is performed, if
     * there is no transaction to undo, null is returned.
     */
    peekUndo() {
        if (this.hasTransactionToUndo()) {
            return this.transactions[this.mostRecentTransaction];
        }
        else
            return null;
    }
    
    /**
     * This function checks to see if there is a transaction to redo. If there
     * is it will return it, if not, it will return null.
     * 
     * return The transaction that would be executed if redo is performed, if
     * there is no transaction to undo, null is returned.
     */    
    peekDo() {
        if (this.hasTransactionToRedo()) {
            return this.transactions[this.mostRecentTransaction+1];
        }
        else
            return null;
    }

    /**
     * This function gets the most recently executed transaction on the 
     * TPS stack and undoes it, moving the TPS counter accordingly.
     */
     async undoTransaction() {
		let retVal;
        if(this.isPerformingDo() || this.isPerformingUndo()) return;
        if (this.hasTransactionToUndo()) {
            this.performingUndo = true;
            let transaction = this.transactions[this.mostRecentTransaction];
			retVal = await transaction.undoTransaction();
            this.mostRecentTransaction--;
			this.performingUndo = false;
        }
        console.log('transactions: ' + this.getSize());
        console.log('redo transactions:' + this.getRedoSize());
        console.log('undo transactions:' + this.getUndoSize());
		console.log(this.mostRecentTransaction)
        console.log(' ')
		return(retVal);
    }

    /**
     * This method clears all transactions from the TPS stack
     * and resets the counter that keeps track of the location
     * of the top of the stack.
     */
    clearAllTransactions() {
        // REMOVE ALL THE TRANSACTIONS
        this.transactions = [];
        
        // MAKE SURE TO RESET THE LOCATION OF THE
        // TOP OF THE TPS STACK TOO
        this.mostRecentTransaction = -1;        
    }
    
    /**
     * Accessor method that returns the number of transactions currently
     * on the transaction stack. This includes those that may have been
     * done, undone, and redone.
     * 
     * return The number of transactions currently in the transaction stack.
     */
    getSize() {
        return this.transactions.length;
    }
    
    /**
     * This method returns the number of transactions currently in the
     * transaction stack that can be redone, meaning they have been added
     * and done, and then undone.
     * 
     * return The number of transactions in the stack that can be redone.
     */
    getRedoSize() {
        return this.getSize() - this.mostRecentTransaction - 1;
    }

    /**
     * This method returns the number of transactions currently in the 
     * transaction stack that can be undone.
     * 
     * return The number of transactions in the transaction stack that
     * can be undone.
     */
    getUndoSize() {
        return this.mostRecentTransaction + 1;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be undone at the time this function is called.
     * 
     * return true if an undo operation is possible, false otherwise.
     */
    hasTransactionToUndo() {
        return this.mostRecentTransaction >= 0;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be redone at the time this function is called.
     * 
     * return true if a redo operation is possible, false otherwise.
     */
    hasTransactionToRedo() {
        return this.mostRecentTransaction < (this.transactions.length-1);
    }
        
    /**
     * This method builds and returns a textual summary of the current
     * Transaction Processing System, this includes the toString of
     * each transaction in the stack.
     * 
     * return A textual summary of the TPS.
     */
    // toString() {
    //     let text = "<br>" +"--Number of Transactions: " + this.transactions.length + "</br>";
    //     text += "<br>" + "--Current Index on Stack: " + this.mostRecentTransaction + "</br>";
    //     text += "<br>" + "--Current Transaction Stack:" + "</br>";
    //     for (let i = 0; i <= this.mostRecentTransaction; i++) {
    //         let jsT = this.transactions[i];
    //         text += "<br>" + "----" + jsT.toString() + "</br>";
    //     }
    //     return text;
    // }
}