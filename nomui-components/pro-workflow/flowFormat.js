define([], function () {
    class FlowFormat extends nomui.Component {
        constructor(props, ...mixins) {
            const defaults = {
                oldFlowUIData: {},
                steps: [],
                lines: [],
                firstStep: {},
                lastStep: {},
                newFlowUIData: {},
                personSelectData: { dataModel: [] }
            }
            super(nomui.Component.extendProps(defaults, props), ...mixins)
        }

        _config() {
        }

        _created() {

        }
        _rendered() {

        }

        // 根据老工作流数据，获取新工作流数据
        getNewData() {
            var result = {
                id: this.props.oldFlowUIData.id,
                database: this.props.oldFlowUIData.database,
                data: [],
                lines: this.props.oldFlowUIData.lines
            };

            result.data = this.getNewDataProp();
            return result;
        }

        updateOldFlowUIData(data) {
            this.props.oldFlowUIData = data
        }

        updateNewFlowUIData(data) {
            this.props.newFlowUIData = data
        }

        // 根据新工作流数据，获取老工作流数据
        getOldData() {
            var result = {
                id: this.props.newFlowUIData.id,
                database: this.props.newFlowUIData.database,
                steps: [],
                lines: []//重新生成
            }
            // 避免移除前后线属性，导致数据源被删
            var clonNewDataOfStep = JSON.parse(JSON.stringify(this.props.newFlowUIData));
            this.analysisOldDataSteps(result.steps, clonNewDataOfStep.data,);
            var prevSteps = [];
            var clonNewDataOfLine = JSON.parse(JSON.stringify(this.props.newFlowUIData));
            this.analysisOldDataLines(result.lines, clonNewDataOfLine.data, prevSteps);
            if (!result.database) {
                Reflect.deleteProperty(result, 'database')
            }
            result.steps.map((n, i) => {
                if (n.hidden) {
                    n.isVirtual = 1;
                } else {
                    n.isVirtual = 0;
                }
                Reflect.deleteProperty(n, 'hidden')
            });
            return result;
        }

        analysisOldDataSteps(steps, data) {
            for (const step of data) {
                if (step.hasOwnProperty('children')) {
                    this.getStepChildren(steps, step);
                } else {
                    if (step.hasOwnProperty('selectDataModel') && step.selectDataModel) {
                        this.props.personSelectData.dataModel.push(step.selectDataModel);
                        Reflect.deleteProperty(step, 'selectDataModel')
                    }
                    if (step.hasOwnProperty('condition')) {
                        Reflect.deleteProperty(step, 'condition')
                    }
                    steps.push(step);
                }
            }
        }

        analysisOldDataLines(lines, data, prevSteps) {
            var i = 0;
            var parentSteps = JSON.parse(JSON.stringify(prevSteps));
            prevSteps.length = 0;
            for (const step of data) {
                i++;
                if (step.hasOwnProperty('children')) {
                    this.getLinesChildren(lines, step, parentSteps);
                } else {
                    if (parentSteps.length == 0) {
                        parentSteps = [step];
                        continue;
                    } else if (parentSteps.length == 1) {
                        this.singlePrevSteps(lines, step, parentSteps[0]);
                    } else {
                        this.multiPrevSteps(lines, step, parentSteps)
                    }

                    parentSteps = [step];
                }

                if (i == data.length) {
                    parentSteps.map((n, i) => {
                        prevSteps.push(n);
                    })
                }
            }
        }

        multiPrevSteps(lines, step, prevSteps) {
            for (const prevStep of prevSteps) {
                this.singlePrevSteps(lines, step, prevStep);
            }
        }

        singlePrevSteps(lines, step, prevStep) {
            lines.push({
                id: nomui.utils.newGuid(),
                from: prevStep.id,
                to: step.id,
                customMethod: step.condition.customMethod ? step.condition.customMethod : '',
                sqlWhere: step.condition.sqlWhere ? step.condition.sqlWhere : '',
                noaccordMsg: step.condition.noaccordMsg ? step.condition.noaccordMsg : '',
                isConditionLine: step.condition.isConditionLine ? step.condition.isConditionLine : false
            });
        }

        getStepChildren(steps, childrenObj) {
            for (const itemSteps of childrenObj.children) {
                this.analysisOldDataSteps(steps, itemSteps);
            }
        }

        getLinesChildren(lines, childrenObj, prevSteps) {
            var parentSteps = JSON.parse(JSON.stringify(prevSteps));
            prevSteps.length = 0;
            childrenObj.children.map((itemSteps, i) => {
                var tempParentSteps = JSON.parse(JSON.stringify(parentSteps));
                this.analysisOldDataLines(lines, itemSteps, tempParentSteps);
                tempParentSteps.map((n, i) => {
                    prevSteps.push(n);
                })
            })
        }

        // 将老数据步骤初始为WfStep
        initSteps() {
            for (var i = 0; i < this.props.oldFlowUIData.steps.length; i++) {
                var step = this.props.oldFlowUIData.steps[i];
                if (step.hasOwnProperty('isVirtual')) {
                    if (step.isVirtual == 1) {
                        step.hidden = true;
                    } else {
                        step.hidden = false;
                    }
                    Reflect.deleteProperty(step, 'isVirtual')
                } else {
                    step.hidden = false;
                }
                this.setStepContidition(step);
                this.props.steps.push(step);
            }
        }
        getStepLines(step, beforeLines, afterLines) {
            if (!this.props.oldFlowUIData.lines) {
                return;
            }
            for (const line of this.props.oldFlowUIData.lines) {
                if (line.to == step.id) {
                    beforeLines.push(line);
                } else if (line.from == step.id) {
                    afterLines.push(line);
                }
            }
            return;
        }
        // 获取第一步
        initFirstStep() {
            if (this.props.steps.length == 1) {
                this.props.firstStep = this.props.steps[0];
            } else {
                this.props.steps.some(stepItem => {
                    var lineToStep = this.props.oldFlowUIData.lines.find(lineItem => {
                        return lineItem.to == stepItem.id;
                    });
                    if (!lineToStep) {
                        this.props.firstStep = stepItem;
                        return true;// 跳出some
                    }
                });
            }
        }

        // 获取最后一步
        initLastStep() {
            if (this.props.steps.length == 1) {
                this.props.lastStep = this.props.steps[0];
            } else {
                this.props.steps.some(stepItem => {
                    var lineToStep = this.props.oldFlowUIData.lines.find(lineItem => {
                        return lineItem.from == stepItem.id;
                    });
                    if (!lineToStep) {
                        this.props.lastStep = stepItem;
                        return true;// 跳出some
                    }
                });
            }
        }

        // 获取上一级所有步骤
        getPrevSteps(step) {
            if (!this.props.oldFlowUIData.lines) {
                return [];
            }
            var prevLines = this.props.oldFlowUIData.lines.filter(s => {
                return s.to == step.id;
            });
            if (!prevLines) {
                return [];
            }
            var prevStepInfos = this.props.steps.filter(s => {
                return prevLines.some(l => l.from == s.id);
            });
            var prevSteps = [];
            for (var i = 0; i < prevStepInfos.length; i++) {
                prevSteps.push(prevStepInfos[i]);
            }
            return prevSteps;
        }

        getPrevStepCount(step) {
            var prevSteps = this.getPrevSteps(step);
            if (!prevSteps) {
                return 0;
            }
            return prevSteps.length;
        }

        // 获取下一级所有步骤
        getNextSteps(step) {
            if (!this.props.oldFlowUIData.lines) {
                return [];
            }
            var nextLines = this.props.oldFlowUIData.lines.filter(s => {
                return s.from == step.id;
            });
            if (!nextLines) {
                return [];
            }
            var nextStepInfos = this.props.steps.filter(s => {
                return nextLines.some(l => l.to == s.id);
            });
            var nextSteps = [];
            for (var i = 0; i < nextStepInfos.length; i++) {
                nextSteps.push(nextStepInfos[i]);
            }
            return nextSteps;
        }

        getNextStepCount() {
            var nextSteps = this.getNextSteps(step);
            if (!nextSteps) {
                return 0;
            }
            return nextSteps.length;
        }

        getNewDataProp() {
            this.initSteps();
            this.initFirstStep();
            this.initLastStep();

            var result = [];
            var headerSteps = this.startFirstStepAnalysis(this.props.firstStep, result);
            var childrenIndex = result.length;
            var footSteps = this.startLastStepAnalysis(this.props.lastStep, result, childrenIndex);
            if (headerSteps && headerSteps.length > 1) {
                var childrenObj = this.convertToDataFormat(headerSteps, footSteps);
                result.splice(childrenIndex, 0, childrenObj);
            }
            return result;
        }

        startFirstStepAnalysis(step, result) {
            var exist = result.find(s => {
                return s.id == step.id;
            });
            if (exist) {
                return;
            }
            result.push(step);

            var nextSteps = this.getNextSteps(step);
            if (nextSteps.length == 0) {
                return;
            }
            if (nextSteps.length == 1) {
                return this.startFirstStepAnalysis(nextSteps[0], result);
            } else {
                return nextSteps;
            }
        }

        setStepContidition(step) {
            var prevCount = this.getPrevStepCount(step)
            if (prevCount == 1) {
                var line = this.props.oldFlowUIData.lines.find(s => s.to == step.id);
                step.condition = {
                    customMethod: line.customMethod ? line.customMethod : '',
                    sqlWhere: line.sqlWhere ? line.sqlWhere : '',
                    noaccordMsg: line.noaccordMsg ? line.noaccordMsg : '',
                    isConditionLine: line.isConditionLine ? line.isConditionLine : false
                }
            } else {
                step.condition = {
                    customMethod: '',
                    sqlWhere: '',
                    noaccordMsg: '',
                    isConditionLine: false
                }
            }
        }

        startLastStepAnalysis(step, result, childrenIndex) {
            var exist = result.find(s => {
                return s.id == step.id;
            });
            if (exist) {
                return;
            }
            result.splice(childrenIndex, 0, step);

            var prevSteps = this.getPrevSteps(step);
            if (prevSteps.length == 0) {
                return;
            }
            if (prevSteps.length == 1) {
                return this.startLastStepAnalysis(prevSteps[0], result, childrenIndex);
            } else {
                return prevSteps;
            }
        }

        // 转换为新数据格式
        convertToDataFormat(headerSteps, footSteps) {
            var result = {
                children: []
            };
            var branchs = this.getChunk(headerSteps, footSteps);
            for (const ele of branchs) {
                var arr = [];
                this.getStepObjFormat(ele.headerSteps, ele.footSteps, arr);
                result.children.push(arr);
            };
            return result;
        }

        getStepObjFormat(headerSteps, footSteps, arr) {
            if (headerSteps.length == 1) {
                arr.push(headerSteps[0]);

                var nextSteps = this.getNextSteps(headerSteps[0]);
                if (nextSteps.length == 0) {
                    return;
                }
                if (nextSteps.length == 1) {
                    var getPrevStepCount = this.getPrevStepCount(nextSteps[0]);
                    if (getPrevStepCount > 1) {
                        // 并行步骤
                        return;
                    }
                    this.getStepObjFormat(nextSteps, footSteps, arr);
                } else {
                    this.getChildrenObj(nextSteps, footSteps, arr);
                }

            } else {
                var childrenObj = {
                    children: []
                };
                for (var step of headerSteps) {
                    var tempArr = [];
                    this.singleHeadStep(step, footSteps, tempArr);
                    childrenObj.children.push(tempArr);
                }
                arr.push(childrenObj);
                if (footSteps.length == 1) {
                    arr.push(footSteps[0]);
                }
            }
        }

        getChildrenObj(headerSteps, footSteps, arr) {
            var childrenObj = {
                children: []
            };
            var branchs = this.getChunk(headerSteps, footSteps);
            var firstBranch = branchs[0];
            if (branchs.length == 1
                && firstBranch.footSteps.length == 1
                && firstBranch.headerSteps.length > 1) {
                // 头部步骤和父级步骤只差一级，则把chunk头部拆分
                var prevSteps = this.getPrevSteps(firstBranch.footSteps[0]);
                var count = 0;
                for (const h of firstBranch.headerSteps) {
                    if (prevSteps.find(s => s.id == h.id)) {
                        count++;
                    }
                }
                if (count == firstBranch.headerSteps.length) {
                    branchs = [];
                    for (const h of firstBranch.headerSteps) {
                        var chunk = {};
                        chunk.headerSteps = [h];
                        chunk.footSteps = [h];
                        branchs.push(chunk);
                    }
                }
            }
            for (const ele of branchs) {
                var childrenObjChildArr = [];
                this.getArrFormat(ele.headerSteps, ele.footSteps, childrenObjChildArr)
                childrenObj.children.push(childrenObjChildArr);
            };
            arr.push(childrenObj);
        }

        getArrFormat(headerSteps, footSteps, arr) {
            if (headerSteps.length == 1 || footSteps.length == 1) {
                this.getStepObjFormat(headerSteps, footSteps, arr);
            }
            else {
                // 头部、尾部都是多个
                var childrenObj = {
                    children: []
                };
                var childrenObjChildArr = [];
                this.getChildrenObj(headerSteps, footSteps, childrenObjChildArr);
                childrenObj.children.push(childrenObjChildArr);
                arr.push(childrenObj);
            }
        }

        // 一个头部，多个尾部
        singleHeadStep(step, footSteps, arr) {
            arr.push(step);

            var nextSteps = this.getNextSteps(step);
            if (nextSteps.length == 0) {
                return;
            }
            if (nextSteps.length == 1) {
                var getPrevStepCount = this.getPrevStepCount(nextSteps[0]);
                if (getPrevStepCount > 1) {
                    // 并行步骤
                    return;
                }
                this.singleHeadStep(nextSteps[0], footSteps, arr);
            } else {
                this.getChildrenObj(nextSteps, footSteps, arr);
            }
        }

        getChunk(headerSteps, footSteps) {
            var roadInfos = [];
            for (const s of headerSteps) {
                var endSteps = [];
                this.getEndStep(s, footSteps, endSteps);
                for (const ele of endSteps) {
                    roadInfos.push({ startStep: s, endStep: ele });
                }
            };

            var result = this.convertToChunk(roadInfos);
            return result;
        }

        getEndStep(step, footSteps, result) {
            if (footSteps.length == 1 && step.id == footSteps[0].id) {
                if (result.length == 0 || result.find(s => s.id != step.id)) {
                    result.push(step);
                }
                return;
            }
            var footStep = footSteps.find(f => f.id == step.id);
            if (footStep) {
                result.push(step);
                return;
            }
            var nextSteps = this.getNextSteps(step);
            if (nextSteps.length == 0) {
                return;
            }
            var effectiveSteps = [];
            var notEffectiveSteps = [];
            for (var i = 0; i < nextSteps.length; i++) {
                if (footSteps.find(f => f.id == nextSteps[i].id)) {
                    effectiveSteps.push(nextSteps[i]);
                } else {
                    notEffectiveSteps.push(nextSteps[i]);
                }
            }
            var steps = effectiveSteps;
            if (notEffectiveSteps.length > 0) {
                steps = effectiveSteps.concat(notEffectiveSteps[0]);
            }

            // if (steps.length == 1) {
            //     var prevSteps = this.getPrevStepCount(steps[0]);
            //     if (prevSteps > 1) {
            //         result.push({ id: 'empty' });
            //         return;
            //     }
            // }
            for (var i = 0; i < steps.length; i++) {
                this.getEndStep(steps[i], footSteps, result);
            }

        }

        convertToChunk(roadInfos) {
            var result = [];
            for (const ro of roadInfos) {
                if (ro.endStep.id == 'empty') {
                    var chunk = {};
                    chunk.headerSteps = [];
                    chunk.footSteps = [];
                    chunk.headerSteps.push(ro.startStep);
                    chunk.footSteps.push(ro.endStep);
                    result.push(chunk);
                } else {
                    var startExist = result.find(re => {
                        return re.headerSteps.find(h => h.id == ro.startStep.id);
                    })
                    var endExist = result.find(re => {
                        return re.footSteps.find(h => h.id == ro.endStep.id);
                    })
                    if (!startExist && !endExist) {
                        var chunk = {};
                        chunk.headerSteps = [];
                        chunk.footSteps = [];
                        chunk.headerSteps.push(ro.startStep);
                        chunk.footSteps.push(ro.endStep);
                        result.push(chunk);
                    } else if (startExist) {
                        var existChunk = result.find(s => {
                            return s.headerSteps.find(h => h.id == ro.startStep.id);
                        });
                        existChunk.footSteps.push(ro.endStep);
                    } else if (endExist) {
                        var existChunk = result.find(s => {
                            return s.footSteps.find(h => h.id == ro.endStep.id);
                        });
                        existChunk.headerSteps.push(ro.startStep);
                    }
                }
            };
            return result;
        }
    }

    return FlowFormat
})
