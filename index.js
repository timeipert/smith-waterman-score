const evaluation = (charX, charY, costs) => charX == charY ? costs.match : costs.mismatch         // evaluation function
const createMatrix = (length1, length2) => [...new Array(length1)].map(a => [...new Array(length2)].map(b => 1))
const initXAxis = (fields, value) => fields.map((field, i) => !i ? field.map(d => value) : field)
const initYAxis = (fields, value) => fields.map(xAxis => xAxis.map((yAxis, axisIndex) => axisIndex === 0 ? value : 0))

const tracebackDirectionHash = ['d', 'u', 'l']

const F = (i, j, ma, costs) => {
      let tracebackPoint = ''
      // console.log(ma.matches, i, j)
      // console.log(ma.sequence[i - 1], ma.pattern[j - 1])

      let matches = [
            +ma.matches[j - 1][i - 1] + evaluation(ma.sequence[i - 1], ma.pattern[j - 1], costs),
            +ma.matches[j - 1][i] + costs.gap,
            +ma.matches[j][i - 1] + costs.gap
      ]

      // Hole den besten Match
      let bestMatch = Math.max(...matches)

      // Falls es mehrere gleichwertige Matches gibt und der diagonale dabei ist, wähle diesen aus, sonst wähle den
      // mit dem besten Match
      if (matches.filter(e => bestMatch === e).length > 1 && matches[0] === bestMatch && bestMatch > 0) tracebackPoint = tracebackDirectionHash[0]       // Diagonal
      else if (matches.filter(e => bestMatch === e).length == 1 && bestMatch > 0) tracebackPoint = tracebackDirectionHash[matches.indexOf(bestMatch)]
      else if (bestMatch <= 0) {
            tracebackPoint = 0
            bestMatch = 0
      }
      return [bestMatch, tracebackPoint]
}

const matrix = (seq, pattern) => ({
      'sequence': seq,
      'pattern': pattern,
      'matches': createMatrix(pattern.length + 1, seq.length + 1),
      'traceback': createMatrix(pattern.length + 1, seq.length + 1),
      'peak': {'cell': {}, 'value': 0},
      'initalizeMatrix': function () {
            this.matches = initXAxis(initYAxis(this.matches, 0), 0)
            this.traceback = initXAxis(initYAxis(this.matches, 0), 0)
            this.traceback[0][0] = 0
      },
      'computeScore': function (costs) {
            const tracebackMatrix = this.traceback
            this.traceback = tracebackMatrix.map((row, yIndex) => {
                  if (yIndex === 0) return row;
                  return row.map((element, xIndex) => {
                        if (xIndex === 0) return element;
                        let field = F(xIndex, yIndex, this, costs)
                        if (this.peak['value'] <= field[0]) {
                              this.peak['cell'] = {x: +xIndex, y: +yIndex}
                              this.peak['value'] = field[0]
                        }
                        this.matches[yIndex][xIndex] = field[0] // match
                        return field[1] // traceback
                  })
            });
      },
      'trace': [],
      'getTrace': function () {
            let it = 0
            let activeCell = Object.assign({}, this.peak['cell'])
            while (this.traceback[activeCell['y']][activeCell['x']] !== 0) {
                  if (it > 20) break
                  it += 1
                  if (this.traceback[activeCell['y']][activeCell['x']] === 'd') {
                        this.trace.push({
                              'seqChar': this.sequence[activeCell['x'] - 1],
                              'patChar': this.pattern[activeCell['y'] - 1],
                              'seqIndex': activeCell['x'],
                              'patIndex': activeCell['y']
                        })
                        activeCell['x'] -= 1
                        activeCell['y'] -= 1
                  }
                  else if (this.traceback[activeCell['y']][activeCell['x']] === 'u') {
                        this.trace.push({
                              'seqChar': "-",
                              'patChar': this.pattern[activeCell['y'] - 1],
                              'seqIndex': activeCell['x'],
                              'patIndex': activeCell['y']
                        })
                        activeCell['x'] -= 1
                  }
                  else if (this.traceback[activeCell['y']][activeCell['x']] === 'l') {
                        this.trace.push({
                              'seqChar': this.sequence[activeCell['x'] - 1],
                              'patChar': '-',
                              'seqIndex': activeCell['x'],
                              'patIndex': activeCell['y']
                        })
                        activeCell['y'] -= 1
                  }

            }
      }
});

const smith_waterman = (text, pattern, costs) => {
      const M = matrix(text, pattern);
      M.initalizeMatrix()
      M.computeScore(costs)
      M.getTrace()
      return M;
}
module.exports = smith_waterman