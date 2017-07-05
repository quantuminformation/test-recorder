console.log('test recorder loaded')

var _Mathfloor = Math.floor, _Mathpow = Math.pow, _StringfromCharCode = String.fromCharCode, _Mathmin = Math.min;
(function (r, u) {
  'object' == typeof exports && 'object' == typeof module ? module.exports = u() : 'function' == typeof define && define.amd ? define('TestRecorder', [], u) : 'object' == typeof exports ? exports.TestRecorder = u() : r.TestRecorder = u()
})(this, function () {
  return function (t) {
    function r (f) {
      if (u[f])return u[f].exports;
      var h = u[f] = { i: f, l: !1, exports: {} };
      return t[f].call(h.exports, h, h.exports, r), h.l = !0, h.exports
    }

    var u = {};
    return r.m = t, r.c = u, r.i = function (f) {
      return f
    }, r.d = function (f, h, E) {
      r.o(f, h) || Object.defineProperty(f, h, { configurable: !1, enumerable: !0, get: E })
    }, r.n = function (f) {
      var h = f && f.__esModule ? function () {
        return f['default']
      } : function () {
        return f
      };
      return r.d(h, 'a', h), h
    }, r.o = function (f, h) {
      return Object.prototype.hasOwnProperty.call(f, h)
    }, r.p = '', r(r.s = 17)
  }([function (t, r, u) {
    'use strict';
    function f (M) {
      let G = M.parentNode;
      if (!G)return -1;
      let H = G instanceof HTMLElement ? G.children : G.childNodes, z = [].some.call(H, function (q) {
        return q.tagName === M.tagName && q !== M
      });
      return z ? Array.from(H).indexOf(M) + 1 : -1
    }

    function h (M) {
      if (M.target.id)return '#' + M.target.id;
      let G = T(R(M.path)).reverse(), H = G.map(function (z) {
        let q = f(z), F = z.id ? `#${z.id}` : '',
          X = z.className ? `.${Array.from(z.classList).map((V) => V).join('.')}` : '';
        return z.localName + F + X + (-1 === q ? '' : ':nth-child(' + q + ')')
      }).join('>');
      return console.log(H), H
    }

    function E (M, G) {
      for (let H = 0; H < M.length; H++)if (-1 !== Array.from(M[H].classList).indexOf(G))return !0;
      return !1
    }

    function A (M, G) {
      let H = M.classList && Array.prototype.slice.call(M.classList), z = !!H && -1 !== H.indexOf('doNotRecord');
      return !!z || !!M.parentElement && A(M.parentElement, G)
    }

    function R (M) {
      let G = M.length;
      for (let H = 0; H < G; H++)if ('BODY' === M[H].tagName)return M.slice(0, H + 1)
    }

    function T (M) {
      let G = M.length;
      for (let H = 0; H < G; H++)if (M[H].className || M[H].id)return M.slice(0, H + 1);
      return M
    }

    var C = u(18), P = u(16), w = u(14), S = u.n(w), I = u(19), O = u(11), U = u.n(O), B = u(10), N = u.n(B), D = u(15);
    class Y {
      constructor () {
        this.mutationObserversArr = [], this.generatedTestCode = '', this.cachedMutations = [];
        let M = new P.a, G = new D.a;
        this.codeGenerators = new Map([[G.description, G], [M.description, M]]), this.currentCodeGenerator = this.codeGenerators.values().next().value;
        let H = document.querySelector('body'), z = document.createElement('div');
        z.innerHTML = `<div id="testRecorderUI" class="doNotRecord">
        <div class="header">
          <span id="clear" >&#x1F6AB;</span>
          <span id="debug">&#x1F41B;</span>
          <button id="copy">Copy</button>
          <select id="framework-choice">
            ${Array.from(this.codeGenerators.keys()).map((F) => `<option value="${F}">${F}</option>`).join('')}
          </select>
          <span class="info" >&#x1F3F7;</span>
        </div>
        <div id="generatedScript" class="language-javascript"></div> 
        </div>
    </div> `, document.body.appendChild(z.firstChild);
        let q = document.getElementById('generatedScript');
        this.hostElement = q, this.addObserverForTarget(H, 0), this.addListeners()
      }

      addListeners () {
        function M (G) {
          return G = R(G), G && 0 !== G.length && !E(G, Y.DO_NOT_RECORD)
        }

        document.querySelector('#copy').addEventListener('click', () => {
          u.i(I.a)(this.hostElement.textContent)
        }), document.querySelector('.info').addEventListener('click', () => {
          alert(`Version: 0.13`)
        }), document.querySelector('#debug').addEventListener('click', () => {
          console.log(this.cachedMutations), console.log(this)
        }), document.querySelector('#clear').addEventListener('click', () => {
          this.setGeneratedScript('')
        }), document.querySelector('#framework-choice').addEventListener('change', (G) => {
          let H = G.target.options[G.target.selectedIndex].value;
          this.currentCodeGenerator = this.codeGenerators.get(H)
        }), document.addEventListener('click', (G) => {
          if (M(G.path) && ('input' !== G.target.localName || 'text' !== G.target.type) && 'html' !== G.target.localName && 'select-one' !== G.target.type) {
            let H = this.currentCodeGenerator.clickHappened(h(G));
            this.appendToGeneratedScript(H), this.awaitMutations()
          }
        }), document.addEventListener('change', (G) => {
          if (M(G.path) && 'select' === G.target.localName) {
            let H = this.currentCodeGenerator.selectChange(h(G), G);
            this.appendToGeneratedScript(H), this.awaitMutations()
          }
        }), document.addEventListener('focusout', (G) => {
          if (M(G.path) && 'INPUT' === G.target.tagName && 'text' === G.target.type) {
            let H = this.currentCodeGenerator.inputTextEdited(h(G), G.target.value);
            this.appendToGeneratedScript(H), this.awaitMutations()
          }
        })
      }

      insertMutationsToGeneratedScript () {
        var M = {};
        this.cachedMutations.forEach((H) => {
          M[H.path] = H
        }), this.cachedMutations = Object.values(M);
        let G = this.cachedMutations.map((H) => H.generatedCode).join('<br>');
        this.setGeneratedScript(this.generatedTestCode.replace(Y.MUTATIONS_PLACEHOLDER, G)), this.cachedMutations = []
      }

      setGeneratedScript (M) {
        this.generatedTestCode = M, this.hostElement.innerHTML = '<pre>' + this.generatedTestCode + '</pre>'
      }

      appendToGeneratedScript (M) {
        this.generatedTestCode += M, this.hostElement.innerHTML = '<pre>' + this.generatedTestCode + '</pre>', Prism.highlightAll()
      }

      awaitMutations () {
        setTimeout(function () {
          this.insertMutationsToGeneratedScript()
        }.bind(this), 500)
      }

      childListMutation (M) {
        let G = [], H = [], z = Array.prototype.slice.call(M.addedNodes),
          q = Array.prototype.slice.call(M.removedNodes);
        return z = z.filter(C.a.filter_DoNotRecord_WhiteSpace_emberID_noID), q = q.filter(C.a.filter_DoNotRecord_WhiteSpace_emberID_noID), z.length || q.length ? z.length && q.length ? void alert('strange') : void(z.forEach((F) => {
          G.push(this.currentCodeGenerator.elementAdded(F.id))
        }), q.forEach((F) => {
          H.push(this.currentCodeGenerator.elementRemoved(F.id))
        }), this.cachedMutations = this.cachedMutations.concat(G.length ? G : H)) : void 0
      }

      addObserverForTarget (M) {
        let H = new MutationObserver((q) => {
          q.forEach((F) => {
            switch (F.type) {
              case'characterData':
                let X = F.target;
                return !X.parentElement.id || A(X, Y.DO_NOT_RECORD) ? void 0 : void this.cachedMutations.push(this.currentCodeGenerator.characterDataChanged(F));
              case'childList':
                return void this.childListMutation(F);
              default:
                console.log(`discarding mutation of type ${F.type}`);
            }
          })
        });
        H.observe(M, {
          attributes: !0,
          childList: !0,
          characterData: !0,
          subtree: !0
        }), console.log(M), this.mutationObserversArr.push(H)
      }
    }
    r.a = Y, Y.MUTATIONS_PLACEHOLDER = '[MUTATIONS_PLACEHOLDER]', Y.DO_NOT_RECORD = 'doNotRecord'
  }, function (t, r) {
    'use strict';
    r.a = class {
      constructor (h, E) {
        this.path = h, this.generatedCode = E
      }
    }
  }, function (t, r) {
    'use strict';
    r.a = {
      indentation: '  ', get indentationX2 () {
        return this.indentation + this.indentation
      }
    }
  }, function (t) {
    var u = function () {
      return this
    }();
    try {
      u = u || Function('return this')() || (1, eval)('this')
    } catch (f) {
      'object' == typeof window && (u = window)
    }
    t.exports = u
  }, function (t, r) {
    'use strict';
    function f (U) {
      var B = U.length;
      if (0 < B % 4)throw new Error('Invalid string. Length must be a multiple of 4');
      return '=' === U[B - 2] ? 2 : '=' === U[B - 1] ? 1 : 0
    }

    function A (U) {
      return C[63 & U >> 18] + C[63 & U >> 12] + C[63 & U >> 6] + C[63 & U]
    }

    function R (U, B, N) {
      for (var D, Y = [], M = B; M < N; M += 3)D = (U[M] << 16) + (U[M + 1] << 8) + U[M + 2], Y.push(A(D));
      return Y.join('')
    }

    r.byteLength = function (U) {
      return 3 * U.length / 4 - f(U)
    }, r.toByteArray = function (U) {
      var B, N, D, Y, M, G, H = U.length;
      M = f(U), G = new w(3 * H / 4 - M), D = 0 < M ? H - 4 : H;
      var z = 0;
      for (B = 0, N = 0; B < D; B += 4, N += 3)Y = P[U.charCodeAt(B)] << 18 | P[U.charCodeAt(B + 1)] << 12 | P[U.charCodeAt(B + 2)] << 6 | P[U.charCodeAt(B + 3)], G[z++] = 255 & Y >> 16, G[z++] = 255 & Y >> 8, G[z++] = 255 & Y;
      return 2 === M ? (Y = P[U.charCodeAt(B)] << 2 | P[U.charCodeAt(B + 1)] >> 4, G[z++] = 255 & Y) : 1 === M && (Y = P[U.charCodeAt(B)] << 10 | P[U.charCodeAt(B + 1)] << 4 | P[U.charCodeAt(B + 2)] >> 2, G[z++] = 255 & Y >> 8, G[z++] = 255 & Y), G
    }, r.fromByteArray = function (U) {
      for (var B, N = U.length, D = N % 3, Y = '', M = [], G = 16383, H = 0, z = N - D; H < z; H += G)M.push(R(U, H, H + G > z ? z : H + G));
      return 1 == D ? (B = U[N - 1], Y += C[B >> 2], Y += C[63 & B << 4], Y += '==') : 2 == D && (B = (U[N - 2] << 8) + U[N - 1], Y += C[B >> 10], Y += C[63 & B >> 4], Y += C[63 & B << 2], Y += '='), M.push(Y), M.join('')
    };
    for (var C = [], P = [], w = 'undefined' == typeof Uint8Array ? Array : Uint8Array, S = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', I = 0, O = S.length; I < O; ++I)C[I] = S[I], P[S.charCodeAt(I)] = I;
    P['-'.charCodeAt(0)] = 62, P['_'.charCodeAt(0)] = 63
  }, function (t, r, u) {
    'use strict';
    (function (f) {
      function E () {
        return R.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
      }

      function A (Re, Te) {
        if (E() < Te)throw new RangeError('Invalid typed array length');
        return R.TYPED_ARRAY_SUPPORT ? (Re = new Uint8Array(Te), Re.__proto__ = R.prototype) : (null === Re && (Re = new R(Te)), Re.length = Te), Re
      }

      function R (Re, Te, Ce) {
        if (!R.TYPED_ARRAY_SUPPORT && !(this instanceof R))return new R(Re, Te, Ce);
        if ('number' == typeof Re) {
          if ('string' == typeof Te)throw new Error('If encoding is specified then the first argument must be a string');
          return w(this, Re)
        }
        return T(this, Re, Te, Ce)
      }

      function T (Re, Te, Ce, ke) {
        if ('number' == typeof Te)throw new TypeError('"value" argument must not be a number');
        return 'undefined' != typeof ArrayBuffer && Te instanceof ArrayBuffer ? O(Re, Te, Ce, ke) : 'string' == typeof Te ? S(Re, Te, Ce) : U(Re, Te)
      }

      function C (Re) {
        if ('number' != typeof Re)throw new TypeError('"size" argument must be a number'); else if (0 > Re)throw new RangeError('"size" argument must not be negative')
      }

      function P (Re, Te, Ce, ke) {
        return C(Te), 0 >= Te ? A(Re, Te) : void 0 === Ce ? A(Re, Te) : 'string' == typeof ke ? A(Re, Te).fill(Ce, ke) : A(Re, Te).fill(Ce)
      }

      function w (Re, Te) {
        if (C(Te), Re = A(Re, 0 > Te ? 0 : 0 | B(Te)), !R.TYPED_ARRAY_SUPPORT)for (var Ce = 0; Ce < Te; ++Ce)Re[Ce] = 0;
        return Re
      }

      function S (Re, Te, Ce) {
        if (('string' != typeof Ce || '' === Ce) && (Ce = 'utf8'), !R.isEncoding(Ce))throw new TypeError('"encoding" must be a valid string encoding');
        var ke = 0 | D(Te, Ce);
        Re = A(Re, ke);
        var Pe = Re.write(Te, Ce);
        return Pe !== ke && (Re = Re.slice(0, Pe)), Re
      }

      function I (Re, Te) {
        var Ce = 0 > Te.length ? 0 : 0 | B(Te.length);
        Re = A(Re, Ce);
        for (var ke = 0; ke < Ce; ke += 1)Re[ke] = 255 & Te[ke];
        return Re
      }

      function O (Re, Te, Ce, ke) {
        if (Te.byteLength, 0 > Ce || Te.byteLength < Ce)throw new RangeError('\'offset\' is out of bounds');
        if (Te.byteLength < Ce + (ke || 0))throw new RangeError('\'length\' is out of bounds');
        return Te = void 0 === Ce && void 0 === ke ? new Uint8Array(Te) : void 0 === ke ? new Uint8Array(Te, Ce) : new Uint8Array(Te, Ce, ke), R.TYPED_ARRAY_SUPPORT ? (Re = Te, Re.__proto__ = R.prototype) : Re = I(Re, Te), Re
      }

      function U (Re, Te) {
        if (R.isBuffer(Te)) {
          var Ce = 0 | B(Te.length);
          return (Re = A(Re, Ce), 0 === Re.length) ? Re : (Te.copy(Re, 0, 0, Ce), Re)
        }
        if (Te) {
          if ('undefined' != typeof ArrayBuffer && Te.buffer instanceof ArrayBuffer || 'length' in Te)return 'number' != typeof Te.length || ye(Te.length) ? A(Re, 0) : I(Re, Te);
          if ('Buffer' === Te.type && xe(Te.data))return I(Re, Te.data)
        }
        throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
      }

      function B (Re) {
        if (Re >= E())throw new RangeError('Attempt to allocate Buffer larger than maximum size: 0x' + E().toString(16) + ' bytes');
        return 0 | Re
      }

      function D (Re, Te) {
        if (R.isBuffer(Re))return Re.length;
        if ('undefined' != typeof ArrayBuffer && 'function' == typeof ArrayBuffer.isView && (ArrayBuffer.isView(Re) || Re instanceof ArrayBuffer))return Re.byteLength;
        'string' != typeof Re && (Re = '' + Re);
        var Ce = Re.length;
        if (0 === Ce)return 0;
        for (var ke = !1; ;)switch (Te) {
          case'ascii':
          case'latin1':
          case'binary':
            return Ce;
          case'utf8':
          case'utf-8':
          case void 0:
            return ge(Re).length;
          case'ucs2':
          case'ucs-2':
          case'utf16le':
          case'utf-16le':
            return 2 * Ce;
          case'hex':
            return Ce >>> 1;
          case'base64':
            return he(Re).length;
          default:
            if (ke)return ge(Re).length;
            Te = ('' + Te).toLowerCase(), ke = !0;
        }
      }

      function Y (Re, Te, Ce) {
        var ke = !1;
        if ((void 0 === Te || 0 > Te) && (Te = 0), Te > this.length)return '';
        if ((void 0 === Ce || Ce > this.length) && (Ce = this.length), 0 >= Ce)return '';
        if (Ce >>>= 0, Te >>>= 0, Ce <= Te)return '';
        for (Re || (Re = 'utf8'); ;)switch (Re) {
          case'hex':
            return ee(this, Te, Ce);
          case'utf8':
          case'utf-8':
            return Q(this, Te, Ce);
          case'ascii':
            return K(this, Te, Ce);
          case'latin1':
          case'binary':
            return $(this, Te, Ce);
          case'base64':
            return J(this, Te, Ce);
          case'ucs2':
          case'ucs-2':
          case'utf16le':
          case'utf-16le':
            return te(this, Te, Ce);
          default:
            if (ke)throw new TypeError('Unknown encoding: ' + Re);
            Re = (Re + '').toLowerCase(), ke = !0;
        }
      }

      function M (Re, Te, Ce) {
        var ke = Re[Te];
        Re[Te] = Re[Ce], Re[Ce] = ke
      }

      function G (Re, Te, Ce, ke, Pe) {
        if (0 === Re.length)return -1;
        if ('string' == typeof Ce ? (ke = Ce, Ce = 0) : 2147483647 < Ce ? Ce = 2147483647 : -2147483648 > Ce && (Ce = -2147483648), Ce = +Ce, isNaN(Ce) && (Ce = Pe ? 0 : Re.length - 1), 0 > Ce && (Ce = Re.length + Ce), Ce >= Re.length) {
          if (Pe)return -1;
          Ce = Re.length - 1
        } else if (0 > Ce)if (Pe) Ce = 0; else return -1;
        if ('string' == typeof Te && (Te = R.from(Te, ke)), R.isBuffer(Te))return 0 === Te.length ? -1 : H(Re, Te, Ce, ke, Pe);
        if ('number' == typeof Te)return Te &= 255, R.TYPED_ARRAY_SUPPORT && 'function' == typeof Uint8Array.prototype.indexOf ? Pe ? Uint8Array.prototype.indexOf.call(Re, Te, Ce) : Uint8Array.prototype.lastIndexOf.call(Re, Te, Ce) : H(Re, [Te], Ce, ke, Pe);
        throw new TypeError('val must be string, number or Buffer')
      }

      function H (Re, Te, Ce, ke, Pe) {
        function we (je, Ne) {
          return 1 == Le ? je[Ne] : je.readUInt16BE(Ne * Le)
        }

        var Le = 1, Se = Re.length, Ie = Te.length;
        if (void 0 !== ke && (ke = (ke + '').toLowerCase(), 'ucs2' === ke || 'ucs-2' === ke || 'utf16le' === ke || 'utf-16le' === ke)) {
          if (2 > Re.length || 2 > Te.length)return -1;
          Le = 2, Se /= 2, Ie /= 2, Ce /= 2
        }
        var Oe;
        if (Pe) {
          var ve = -1;
          for (Oe = Ce; Oe < Se; Oe++)if (we(Re, Oe) !== we(Te, -1 == ve ? 0 : Oe - ve)) -1 != ve && (Oe -= Oe - ve), ve = -1; else if (-1 == ve && (ve = Oe), Oe - ve + 1 === Ie)return ve * Le
        } else for (Ce + Ie > Se && (Ce = Se - Ie), Oe = Ce; 0 <= Oe; Oe--) {
          for (var Ue = !0, Be = 0; Be < Ie; Be++)if (we(Re, Oe + Be) !== we(Te, Be)) {
            Ue = !1;
            break
          }
          if (Ue)return Oe
        }
        return -1
      }

      function z (Re, Te, Ce, ke) {
        Ce = +Ce || 0;
        var Pe = Re.length - Ce;
        ke ? (ke = +ke, ke > Pe && (ke = Pe)) : ke = Pe;
        var we = Te.length;
        if (0 != we % 2)throw new TypeError('Invalid hex string');
        ke > we / 2 && (ke = we / 2);
        for (var Se, Le = 0; Le < ke; ++Le) {
          if (Se = parseInt(Te.substr(2 * Le, 2), 16), isNaN(Se))return Le;
          Re[Ce + Le] = Se
        }
        return Le
      }

      function q (Re, Te, Ce, ke) {
        return me(ge(Te, Re.length - Ce), Re, Ce, ke)
      }

      function F (Re, Te, Ce, ke) {
        return me(ce(Te), Re, Ce, ke)
      }

      function X (Re, Te, Ce, ke) {
        return F(Re, Te, Ce, ke)
      }

      function V (Re, Te, Ce, ke) {
        return me(he(Te), Re, Ce, ke)
      }

      function W (Re, Te, Ce, ke) {
        return me(fe(Te, Re.length - Ce), Re, Ce, ke)
      }

      function J (Re, Te, Ce) {
        return 0 === Te && Ce === Re.length ? be.fromByteArray(Re) : be.fromByteArray(Re.slice(Te, Ce))
      }

      function Q (Re, Te, Ce) {
        Ce = _Mathmin(Re.length, Ce);
        for (var ke = [], Pe = Te; Pe < Ce;) {
          var we = Re[Pe], Le = null, Se = 239 < we ? 4 : 223 < we ? 3 : 191 < we ? 2 : 1;
          if (Pe + Se <= Ce) {
            var Ie, Oe, ve, Ue;
            1 == Se ? 128 > we && (Le = we) : 2 == Se ? (Ie = Re[Pe + 1], 128 == (192 & Ie) && (Ue = (31 & we) << 6 | 63 & Ie, 127 < Ue && (Le = Ue))) : 3 == Se ? (Ie = Re[Pe + 1], Oe = Re[Pe + 2], 128 == (192 & Ie) && 128 == (192 & Oe) && (Ue = (15 & we) << 12 | (63 & Ie) << 6 | 63 & Oe, 2047 < Ue && (55296 > Ue || 57343 < Ue) && (Le = Ue))) : 4 == Se ? (Ie = Re[Pe + 1], Oe = Re[Pe + 2], ve = Re[Pe + 3], 128 == (192 & Ie) && 128 == (192 & Oe) && 128 == (192 & ve) && (Ue = (15 & we) << 18 | (63 & Ie) << 12 | (63 & Oe) << 6 | 63 & ve, 65535 < Ue && 1114112 > Ue && (Le = Ue))) : void 0
          }
          null === Le ? (Le = 65533, Se = 1) : 65535 < Le && (Le -= 65536, ke.push(55296 | 1023 & Le >>> 10), Le = 56320 | 1023 & Le), ke.push(Le), Pe += Se
        }
        return Z(ke)
      }

      function Z (Re) {
        var Te = Re.length;
        if (Te <= Ae)return _StringfromCharCode.apply(String, Re);
        for (var Ce = '', ke = 0; ke < Te;)Ce += _StringfromCharCode.apply(String, Re.slice(ke, ke += Ae));
        return Ce
      }

      function K (Re, Te, Ce) {
        var ke = '';
        Ce = _Mathmin(Re.length, Ce);
        for (var Pe = Te; Pe < Ce; ++Pe)ke += _StringfromCharCode(127 & Re[Pe]);
        return ke
      }

      function $ (Re, Te, Ce) {
        var ke = '';
        Ce = _Mathmin(Re.length, Ce);
        for (var Pe = Te; Pe < Ce; ++Pe)ke += _StringfromCharCode(Re[Pe]);
        return ke
      }

      function ee (Re, Te, Ce) {
        var ke = Re.length;
        (!Te || 0 > Te) && (Te = 0), (!Ce || 0 > Ce || Ce > ke) && (Ce = ke);
        for (var Pe = '', we = Te; we < Ce; ++we)Pe += pe(Re[we]);
        return Pe
      }

      function te (Re, Te, Ce) {
        for (var ke = Re.slice(Te, Ce), Pe = '', we = 0; we < ke.length; we += 2)Pe += _StringfromCharCode(ke[we] + 256 * ke[we + 1]);
        return Pe
      }

      function ne (Re, Te, Ce) {
        if (0 != Re % 1 || 0 > Re)throw new RangeError('offset is not uint');
        if (Re + Te > Ce)throw new RangeError('Trying to access beyond buffer length')
      }

      function re (Re, Te, Ce, ke, Pe, we) {
        if (!R.isBuffer(Re))throw new TypeError('"buffer" argument must be a Buffer instance');
        if (Te > Pe || Te < we)throw new RangeError('"value" argument is out of bounds');
        if (Ce + ke > Re.length)throw new RangeError('Index out of range')
      }

      function ae (Re, Te, Ce, ke) {
        0 > Te && (Te = 65535 + Te + 1);
        for (var Pe = 0, we = _Mathmin(Re.length - Ce, 2); Pe < we; ++Pe)Re[Ce + Pe] = (Te & 255 << 8 * (ke ? Pe : 1 - Pe)) >>> 8 * (ke ? Pe : 1 - Pe)
      }

      function oe (Re, Te, Ce, ke) {
        0 > Te && (Te = 4294967295 + Te + 1);
        for (var Pe = 0, we = _Mathmin(Re.length - Ce, 4); Pe < we; ++Pe)Re[Ce + Pe] = 255 & Te >>> 8 * (ke ? Pe : 3 - Pe)
      }

      function ie (Re, Te, Ce, ke) {
        if (Ce + ke > Re.length)throw new RangeError('Index out of range');
        if (0 > Ce)throw new RangeError('Index out of range')
      }

      function se (Re, Te, Ce, ke, Pe) {
        return Pe || ie(Re, Te, Ce, 4, 3.4028234663852886e38, -3.4028234663852886e38), Ee.write(Re, Te, Ce, ke, 23, 4), Ce + 4
      }

      function de (Re, Te, Ce, ke, Pe) {
        return Pe || ie(Re, Te, Ce, 8, 1.7976931348623157e308, -1.7976931348623157e308), Ee.write(Re, Te, Ce, ke, 52, 8), Ce + 8
      }

      function le (Re) {
        if (Re = ue(Re).replace(_e, ''), 2 > Re.length)return '';
        for (; 0 != Re.length % 4;)Re += '=';
        return Re
      }

      function ue (Re) {
        return Re.trim ? Re.trim() : Re.replace(/^\s+|\s+$/g, '')
      }

      function pe (Re) {
        return 16 > Re ? '0' + Re.toString(16) : Re.toString(16)
      }

      function ge (Re, Te) {
        Te = Te || Infinity;
        for (var Ce, ke = Re.length, Pe = null, we = [], Le = 0; Le < ke; ++Le) {
          if (Ce = Re.charCodeAt(Le), 55295 < Ce && 57344 > Ce) {
            if (!Pe) {
              if (56319 < Ce) {
                -1 < (Te -= 3) && we.push(239, 191, 189);
                continue
              } else if (Le + 1 === ke) {
                -1 < (Te -= 3) && we.push(239, 191, 189);
                continue
              }
              Pe = Ce;
              continue
            }
            if (56320 > Ce) {
              -1 < (Te -= 3) && we.push(239, 191, 189), Pe = Ce;
              continue
            }
            Ce = (Pe - 55296 << 10 | Ce - 56320) + 65536
          } else Pe && -1 < (Te -= 3) && we.push(239, 191, 189);
          if (Pe = null, 128 > Ce) {
            if (0 > (Te -= 1))break;
            we.push(Ce)
          } else if (2048 > Ce) {
            if (0 > (Te -= 2))break;
            we.push(192 | Ce >> 6, 128 | 63 & Ce)
          } else if (65536 > Ce) {
            if (0 > (Te -= 3))break;
            we.push(224 | Ce >> 12, 128 | 63 & Ce >> 6, 128 | 63 & Ce)
          } else if (1114112 > Ce) {
            if (0 > (Te -= 4))break;
            we.push(240 | Ce >> 18, 128 | 63 & Ce >> 12, 128 | 63 & Ce >> 6, 128 | 63 & Ce)
          } else throw new Error('Invalid code point')
        }
        return we
      }

      function ce (Re) {
        for (var Te = [], Ce = 0; Ce < Re.length; ++Ce)Te.push(255 & Re.charCodeAt(Ce));
        return Te
      }

      function fe (Re, Te) {
        for (var Ce, ke, Pe, we = [], Le = 0; Le < Re.length && !(0 > (Te -= 2)); ++Le)Ce = Re.charCodeAt(Le), ke = Ce >> 8, Pe = Ce % 256, we.push(Pe), we.push(ke);
        return we
      }

      function he (Re) {
        return be.toByteArray(le(Re))
      }

      function me (Re, Te, Ce, ke) {
        for (var Pe = 0; Pe < ke && !(Pe + Ce >= Te.length || Pe >= Re.length); ++Pe)Te[Pe + Ce] = Re[Pe];
        return Pe
      }

      function ye (Re) {
        return Re !== Re
      }

      /*!
       * The buffer module from node.js, for the browser.
       *
       * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
       * @license  MIT
       */
      var be = u(4), Ee = u(8), xe = u(9);
      r.Buffer = R, r.SlowBuffer = function (Re) {
        return +Re != Re && (Re = 0), R.alloc(+Re)
      }, r.INSPECT_MAX_BYTES = 50, R.TYPED_ARRAY_SUPPORT = f.TYPED_ARRAY_SUPPORT === void 0 ? function () {
        try {
          var Re = new Uint8Array(1);
          return Re.__proto__ = {
            __proto__: Uint8Array.prototype, foo: function () {
              return 42
            }
          }, 42 === Re.foo() && 'function' == typeof Re.subarray && 0 === Re.subarray(1, 1).byteLength
        } catch (Te) {
          return !1
        }
      }() : f.TYPED_ARRAY_SUPPORT, r.kMaxLength = E(), R.poolSize = 8192, R._augment = function (Re) {
        return Re.__proto__ = R.prototype, Re
      }, R.from = function (Re, Te, Ce) {
        return T(null, Re, Te, Ce)
      }, R.TYPED_ARRAY_SUPPORT && (R.prototype.__proto__ = Uint8Array.prototype, R.__proto__ = Uint8Array, 'undefined' != typeof Symbol && Symbol.species && R[Symbol.species] === R && Object.defineProperty(R, Symbol.species, {
        value: null,
        configurable: !0
      })), R.alloc = function (Re, Te, Ce) {
        return P(null, Re, Te, Ce)
      }, R.allocUnsafe = function (Re) {
        return w(null, Re)
      }, R.allocUnsafeSlow = function (Re) {
        return w(null, Re)
      }, R.isBuffer = function (Te) {
        return !!(null != Te && Te._isBuffer)
      }, R.compare = function (Te, Ce) {
        if (!R.isBuffer(Te) || !R.isBuffer(Ce))throw new TypeError('Arguments must be Buffers');
        if (Te === Ce)return 0;
        for (var ke = Te.length, Pe = Ce.length, we = 0, Le = _Mathmin(ke, Pe); we < Le; ++we)if (Te[we] !== Ce[we]) {
          ke = Te[we], Pe = Ce[we];
          break
        }
        return ke < Pe ? -1 : Pe < ke ? 1 : 0
      }, R.isEncoding = function (Te) {
        switch ((Te + '').toLowerCase()) {
          case'hex':
          case'utf8':
          case'utf-8':
          case'ascii':
          case'latin1':
          case'binary':
          case'base64':
          case'ucs2':
          case'ucs-2':
          case'utf16le':
          case'utf-16le':
            return !0;
          default:
            return !1;
        }
      }, R.concat = function (Te, Ce) {
        if (!xe(Te))throw new TypeError('"list" argument must be an Array of Buffers');
        if (0 === Te.length)return R.alloc(0);
        var ke;
        if (Ce === void 0)for (Ce = 0, ke = 0; ke < Te.length; ++ke)Ce += Te[ke].length;
        var Pe = R.allocUnsafe(Ce), we = 0;
        for (ke = 0; ke < Te.length; ++ke) {
          var Le = Te[ke];
          if (!R.isBuffer(Le))throw new TypeError('"list" argument must be an Array of Buffers');
          Le.copy(Pe, we), we += Le.length
        }
        return Pe
      }, R.byteLength = D, R.prototype._isBuffer = !0, R.prototype.swap16 = function () {
        var Te = this.length;
        if (0 != Te % 2)throw new RangeError('Buffer size must be a multiple of 16-bits');
        for (var Ce = 0; Ce < Te; Ce += 2)M(this, Ce, Ce + 1);
        return this
      }, R.prototype.swap32 = function () {
        var Te = this.length;
        if (0 != Te % 4)throw new RangeError('Buffer size must be a multiple of 32-bits');
        for (var Ce = 0; Ce < Te; Ce += 4)M(this, Ce, Ce + 3), M(this, Ce + 1, Ce + 2);
        return this
      }, R.prototype.swap64 = function () {
        var Te = this.length;
        if (0 != Te % 8)throw new RangeError('Buffer size must be a multiple of 64-bits');
        for (var Ce = 0; Ce < Te; Ce += 8)M(this, Ce, Ce + 7), M(this, Ce + 1, Ce + 6), M(this, Ce + 2, Ce + 5), M(this, Ce + 3, Ce + 4);
        return this
      }, R.prototype.toString = function () {
        var Te = 0 | this.length;
        return 0 == Te ? '' : 0 === arguments.length ? Q(this, 0, Te) : Y.apply(this, arguments)
      }, R.prototype.equals = function (Te) {
        if (!R.isBuffer(Te))throw new TypeError('Argument must be a Buffer');
        return this === Te || 0 === R.compare(this, Te)
      }, R.prototype.inspect = function () {
        var Te = '', Ce = r.INSPECT_MAX_BYTES;
        return 0 < this.length && (Te = this.toString('hex', 0, Ce).match(/.{2}/g).join(' '), this.length > Ce && (Te += ' ... ')), '<Buffer ' + Te + '>'
      }, R.prototype.compare = function (Te, Ce, ke, Pe, we) {
        if (!R.isBuffer(Te))throw new TypeError('Argument must be a Buffer');
        if (void 0 === Ce && (Ce = 0), void 0 === ke && (ke = Te ? Te.length : 0), void 0 === Pe && (Pe = 0), void 0 === we && (we = this.length), 0 > Ce || ke > Te.length || 0 > Pe || we > this.length)throw new RangeError('out of range index');
        if (Pe >= we && Ce >= ke)return 0;
        if (Pe >= we)return -1;
        if (Ce >= ke)return 1;
        if (Ce >>>= 0, ke >>>= 0, Pe >>>= 0, we >>>= 0, this === Te)return 0;
        for (var Le = we - Pe, Se = ke - Ce, Ie = _Mathmin(Le, Se), Oe = this.slice(Pe, we), ve = Te.slice(Ce, ke), Ue = 0; Ue < Ie; ++Ue)if (Oe[Ue] !== ve[Ue]) {
          Le = Oe[Ue], Se = ve[Ue];
          break
        }
        return Le < Se ? -1 : Se < Le ? 1 : 0
      }, R.prototype.includes = function (Te, Ce, ke) {
        return -1 !== this.indexOf(Te, Ce, ke)
      }, R.prototype.indexOf = function (Te, Ce, ke) {
        return G(this, Te, Ce, ke, !0)
      }, R.prototype.lastIndexOf = function (Te, Ce, ke) {
        return G(this, Te, Ce, ke, !1)
      }, R.prototype.write = function (Te, Ce, ke, Pe) {
        if (void 0 === Ce) Pe = 'utf8', ke = this.length, Ce = 0; else if (void 0 === ke && 'string' == typeof Ce) Pe = Ce, ke = this.length, Ce = 0; else if (isFinite(Ce)) Ce |= 0, isFinite(ke) ? (ke |= 0, void 0 === Pe && (Pe = 'utf8')) : (Pe = ke, ke = void 0); else throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
        var we = this.length - Ce;
        if ((void 0 === ke || ke > we) && (ke = we), 0 < Te.length && (0 > ke || 0 > Ce) || Ce > this.length)throw new RangeError('Attempt to write outside buffer bounds');
        Pe || (Pe = 'utf8');
        for (var Le = !1; ;)switch (Pe) {
          case'hex':
            return z(this, Te, Ce, ke);
          case'utf8':
          case'utf-8':
            return q(this, Te, Ce, ke);
          case'ascii':
            return F(this, Te, Ce, ke);
          case'latin1':
          case'binary':
            return X(this, Te, Ce, ke);
          case'base64':
            return V(this, Te, Ce, ke);
          case'ucs2':
          case'ucs-2':
          case'utf16le':
          case'utf-16le':
            return W(this, Te, Ce, ke);
          default:
            if (Le)throw new TypeError('Unknown encoding: ' + Pe);
            Pe = ('' + Pe).toLowerCase(), Le = !0;
        }
      }, R.prototype.toJSON = function () {
        return { type: 'Buffer', data: Array.prototype.slice.call(this._arr || this, 0) }
      };
      var Ae = 4096;
      R.prototype.slice = function (Te, Ce) {
        var ke = this.length;
        Te = ~~Te, Ce = Ce === void 0 ? ke : ~~Ce, 0 > Te ? (Te += ke, 0 > Te && (Te = 0)) : Te > ke && (Te = ke), 0 > Ce ? (Ce += ke, 0 > Ce && (Ce = 0)) : Ce > ke && (Ce = ke), Ce < Te && (Ce = Te);
        var Pe;
        if (R.TYPED_ARRAY_SUPPORT) Pe = this.subarray(Te, Ce), Pe.__proto__ = R.prototype; else {
          var we = Ce - Te;
          Pe = new R(we, void 0);
          for (var Le = 0; Le < we; ++Le)Pe[Le] = this[Le + Te]
        }
        return Pe
      }, R.prototype.readUIntLE = function (Te, Ce, ke) {
        Te |= 0, Ce |= 0, ke || ne(Te, Ce, this.length);
        for (var Pe = this[Te], we = 1, Le = 0; ++Le < Ce && (we *= 256);)Pe += this[Te + Le] * we;
        return Pe
      }, R.prototype.readUIntBE = function (Te, Ce, ke) {
        Te |= 0, Ce |= 0, ke || ne(Te, Ce, this.length);
        for (var Pe = this[Te + --Ce], we = 1; 0 < Ce && (we *= 256);)Pe += this[Te + --Ce] * we;
        return Pe
      }, R.prototype.readUInt8 = function (Te, Ce) {
        return Ce || ne(Te, 1, this.length), this[Te]
      }, R.prototype.readUInt16LE = function (Te, Ce) {
        return Ce || ne(Te, 2, this.length), this[Te] | this[Te + 1] << 8
      }, R.prototype.readUInt16BE = function (Te, Ce) {
        return Ce || ne(Te, 2, this.length), this[Te] << 8 | this[Te + 1]
      }, R.prototype.readUInt32LE = function (Te, Ce) {
        return Ce || ne(Te, 4, this.length), (this[Te] | this[Te + 1] << 8 | this[Te + 2] << 16) + 16777216 * this[Te + 3]
      }, R.prototype.readUInt32BE = function (Te, Ce) {
        return Ce || ne(Te, 4, this.length), 16777216 * this[Te] + (this[Te + 1] << 16 | this[Te + 2] << 8 | this[Te + 3])
      }, R.prototype.readIntLE = function (Te, Ce, ke) {
        Te |= 0, Ce |= 0, ke || ne(Te, Ce, this.length);
        for (var Pe = this[Te], we = 1, Le = 0; ++Le < Ce && (we *= 256);)Pe += this[Te + Le] * we;
        return we *= 128, Pe >= we && (Pe -= _Mathpow(2, 8 * Ce)), Pe
      }, R.prototype.readIntBE = function (Te, Ce, ke) {
        Te |= 0, Ce |= 0, ke || ne(Te, Ce, this.length);
        for (var Pe = Ce, we = 1, Le = this[Te + --Pe]; 0 < Pe && (we *= 256);)Le += this[Te + --Pe] * we;
        return we *= 128, Le >= we && (Le -= _Mathpow(2, 8 * Ce)), Le
      }, R.prototype.readInt8 = function (Te, Ce) {
        return Ce || ne(Te, 1, this.length), 128 & this[Te] ? -1 * (255 - this[Te] + 1) : this[Te]
      }, R.prototype.readInt16LE = function (Te, Ce) {
        Ce || ne(Te, 2, this.length);
        var ke = this[Te] | this[Te + 1] << 8;
        return 32768 & ke ? 4294901760 | ke : ke
      }, R.prototype.readInt16BE = function (Te, Ce) {
        Ce || ne(Te, 2, this.length);
        var ke = this[Te + 1] | this[Te] << 8;
        return 32768 & ke ? 4294901760 | ke : ke
      }, R.prototype.readInt32LE = function (Te, Ce) {
        return Ce || ne(Te, 4, this.length), this[Te] | this[Te + 1] << 8 | this[Te + 2] << 16 | this[Te + 3] << 24
      }, R.prototype.readInt32BE = function (Te, Ce) {
        return Ce || ne(Te, 4, this.length), this[Te] << 24 | this[Te + 1] << 16 | this[Te + 2] << 8 | this[Te + 3]
      }, R.prototype.readFloatLE = function (Te, Ce) {
        return Ce || ne(Te, 4, this.length), Ee.read(this, Te, !0, 23, 4)
      }, R.prototype.readFloatBE = function (Te, Ce) {
        return Ce || ne(Te, 4, this.length), Ee.read(this, Te, !1, 23, 4)
      }, R.prototype.readDoubleLE = function (Te, Ce) {
        return Ce || ne(Te, 8, this.length), Ee.read(this, Te, !0, 52, 8)
      }, R.prototype.readDoubleBE = function (Te, Ce) {
        return Ce || ne(Te, 8, this.length), Ee.read(this, Te, !1, 52, 8)
      }, R.prototype.writeUIntLE = function (Te, Ce, ke, Pe) {
        if (Te = +Te, Ce |= 0, ke |= 0, !Pe) {
          var we = _Mathpow(2, 8 * ke) - 1;
          re(this, Te, Ce, ke, we, 0)
        }
        var Le = 1, Se = 0;
        for (this[Ce] = 255 & Te; ++Se < ke && (Le *= 256);)this[Ce + Se] = 255 & Te / Le;
        return Ce + ke
      }, R.prototype.writeUIntBE = function (Te, Ce, ke, Pe) {
        if (Te = +Te, Ce |= 0, ke |= 0, !Pe) {
          var we = _Mathpow(2, 8 * ke) - 1;
          re(this, Te, Ce, ke, we, 0)
        }
        var Le = ke - 1, Se = 1;
        for (this[Ce + Le] = 255 & Te; 0 <= --Le && (Se *= 256);)this[Ce + Le] = 255 & Te / Se;
        return Ce + ke
      }, R.prototype.writeUInt8 = function (Te, Ce, ke) {
        return Te = +Te, Ce |= 0, ke || re(this, Te, Ce, 1, 255, 0), R.TYPED_ARRAY_SUPPORT || (Te = _Mathfloor(Te)), this[Ce] = 255 & Te, Ce + 1
      }, R.prototype.writeUInt16LE = function (Te, Ce, ke) {
        return Te = +Te, Ce |= 0, ke || re(this, Te, Ce, 2, 65535, 0), R.TYPED_ARRAY_SUPPORT ? (this[Ce] = 255 & Te, this[Ce + 1] = Te >>> 8) : ae(this, Te, Ce, !0), Ce + 2
      }, R.prototype.writeUInt16BE = function (Te, Ce, ke) {
        return Te = +Te, Ce |= 0, ke || re(this, Te, Ce, 2, 65535, 0), R.TYPED_ARRAY_SUPPORT ? (this[Ce] = Te >>> 8, this[Ce + 1] = 255 & Te) : ae(this, Te, Ce, !1), Ce + 2
      }, R.prototype.writeUInt32LE = function (Te, Ce, ke) {
        return Te = +Te, Ce |= 0, ke || re(this, Te, Ce, 4, 4294967295, 0), R.TYPED_ARRAY_SUPPORT ? (this[Ce + 3] = Te >>> 24, this[Ce + 2] = Te >>> 16, this[Ce + 1] = Te >>> 8, this[Ce] = 255 & Te) : oe(this, Te, Ce, !0), Ce + 4
      }, R.prototype.writeUInt32BE = function (Te, Ce, ke) {
        return Te = +Te, Ce |= 0, ke || re(this, Te, Ce, 4, 4294967295, 0), R.TYPED_ARRAY_SUPPORT ? (this[Ce] = Te >>> 24, this[Ce + 1] = Te >>> 16, this[Ce + 2] = Te >>> 8, this[Ce + 3] = 255 & Te) : oe(this, Te, Ce, !1), Ce + 4
      }, R.prototype.writeIntLE = function (Te, Ce, ke, Pe) {
        if (Te = +Te, Ce |= 0, !Pe) {
          var we = _Mathpow(2, 8 * ke - 1);
          re(this, Te, Ce, ke, we - 1, -we)
        }
        var Le = 0, Se = 1, Ie = 0;
        for (this[Ce] = 255 & Te; ++Le < ke && (Se *= 256);)0 > Te && 0 == Ie && 0 !== this[Ce + Le - 1] && (Ie = 1), this[Ce + Le] = 255 & (Te / Se >> 0) - Ie;
        return Ce + ke
      }, R.prototype.writeIntBE = function (Te, Ce, ke, Pe) {
        if (Te = +Te, Ce |= 0, !Pe) {
          var we = _Mathpow(2, 8 * ke - 1);
          re(this, Te, Ce, ke, we - 1, -we)
        }
        var Le = ke - 1, Se = 1, Ie = 0;
        for (this[Ce + Le] = 255 & Te; 0 <= --Le && (Se *= 256);)0 > Te && 0 == Ie && 0 !== this[Ce + Le + 1] && (Ie = 1), this[Ce + Le] = 255 & (Te / Se >> 0) - Ie;
        return Ce + ke
      }, R.prototype.writeInt8 = function (Te, Ce, ke) {
        return Te = +Te, Ce |= 0, ke || re(this, Te, Ce, 1, 127, -128), R.TYPED_ARRAY_SUPPORT || (Te = _Mathfloor(Te)), 0 > Te && (Te = 255 + Te + 1), this[Ce] = 255 & Te, Ce + 1
      }, R.prototype.writeInt16LE = function (Te, Ce, ke) {
        return Te = +Te, Ce |= 0, ke || re(this, Te, Ce, 2, 32767, -32768), R.TYPED_ARRAY_SUPPORT ? (this[Ce] = 255 & Te, this[Ce + 1] = Te >>> 8) : ae(this, Te, Ce, !0), Ce + 2
      }, R.prototype.writeInt16BE = function (Te, Ce, ke) {
        return Te = +Te, Ce |= 0, ke || re(this, Te, Ce, 2, 32767, -32768), R.TYPED_ARRAY_SUPPORT ? (this[Ce] = Te >>> 8, this[Ce + 1] = 255 & Te) : ae(this, Te, Ce, !1), Ce + 2
      }, R.prototype.writeInt32LE = function (Te, Ce, ke) {
        return Te = +Te, Ce |= 0, ke || re(this, Te, Ce, 4, 2147483647, -2147483648), R.TYPED_ARRAY_SUPPORT ? (this[Ce] = 255 & Te, this[Ce + 1] = Te >>> 8, this[Ce + 2] = Te >>> 16, this[Ce + 3] = Te >>> 24) : oe(this, Te, Ce, !0), Ce + 4
      }, R.prototype.writeInt32BE = function (Te, Ce, ke) {
        return Te = +Te, Ce |= 0, ke || re(this, Te, Ce, 4, 2147483647, -2147483648), 0 > Te && (Te = 4294967295 + Te + 1), R.TYPED_ARRAY_SUPPORT ? (this[Ce] = Te >>> 24, this[Ce + 1] = Te >>> 16, this[Ce + 2] = Te >>> 8, this[Ce + 3] = 255 & Te) : oe(this, Te, Ce, !1), Ce + 4
      }, R.prototype.writeFloatLE = function (Te, Ce, ke) {
        return se(this, Te, Ce, !0, ke)
      }, R.prototype.writeFloatBE = function (Te, Ce, ke) {
        return se(this, Te, Ce, !1, ke)
      }, R.prototype.writeDoubleLE = function (Te, Ce, ke) {
        return de(this, Te, Ce, !0, ke)
      }, R.prototype.writeDoubleBE = function (Te, Ce, ke) {
        return de(this, Te, Ce, !1, ke)
      }, R.prototype.copy = function (Te, Ce, ke, Pe) {
        if (ke || (ke = 0), Pe || 0 === Pe || (Pe = this.length), Ce >= Te.length && (Ce = Te.length), Ce || (Ce = 0), 0 < Pe && Pe < ke && (Pe = ke), Pe === ke)return 0;
        if (0 === Te.length || 0 === this.length)return 0;
        if (0 > Ce)throw new RangeError('targetStart out of bounds');
        if (0 > ke || ke >= this.length)throw new RangeError('sourceStart out of bounds');
        if (0 > Pe)throw new RangeError('sourceEnd out of bounds');
        Pe > this.length && (Pe = this.length), Te.length - Ce < Pe - ke && (Pe = Te.length - Ce + ke);
        var Le, we = Pe - ke;
        if (this === Te && ke < Ce && Ce < Pe)for (Le = we - 1; 0 <= Le; --Le)Te[Le + Ce] = this[Le + ke]; else if (1e3 > we || !R.TYPED_ARRAY_SUPPORT)for (Le = 0; Le < we; ++Le)Te[Le + Ce] = this[Le + ke]; else Uint8Array.prototype.set.call(Te, this.subarray(ke, ke + we), Ce);
        return we
      }, R.prototype.fill = function (Te, Ce, ke, Pe) {
        if ('string' == typeof Te) {
          if ('string' == typeof Ce ? (Pe = Ce, Ce = 0, ke = this.length) : 'string' == typeof ke && (Pe = ke, ke = this.length), 1 === Te.length) {
            var we = Te.charCodeAt(0);
            256 > we && (Te = we)
          }
          if (void 0 !== Pe && 'string' != typeof Pe)throw new TypeError('encoding must be a string');
          if ('string' == typeof Pe && !R.isEncoding(Pe))throw new TypeError('Unknown encoding: ' + Pe)
        } else'number' == typeof Te && (Te &= 255);
        if (0 > Ce || this.length < Ce || this.length < ke)throw new RangeError('Out of range index');
        if (ke <= Ce)return this;
        Ce >>>= 0, ke = ke === void 0 ? this.length : ke >>> 0, Te || (Te = 0);
        var Le;
        if ('number' == typeof Te)for (Le = Ce; Le < ke; ++Le)this[Le] = Te; else {
          var Se = R.isBuffer(Te) ? Te : ge(new R(Te, Pe).toString()), Ie = Se.length;
          for (Le = 0; Le < ke - Ce; ++Le)this[Le + Ce] = Se[Le % Ie]
        }
        return this
      };
      var _e = /[^+\/0-9A-Za-z-_]/g
    }).call(r, u(3))
  }, function (t, r, u) {
    r = t.exports = u(7)(void 0), r.push([t.i, '\n#testRecorderUI {\n  position: fixed !important;\n  bottom: 10px !important;\n  left: 10px !important;\n  width: 250px ;\n  color: white !important;\n  border: 1px solid #0b97c4 !important;\n  height: 350px ;\n  background-color: rgba(11, 11, 11, 0.6) !important;\n  border-radius: 4px !important;\n  font-size: 8px !important;\n  resize: both !important;\n  z-index: 1000 !important;\n  resize: both !important;\n  overflow: auto !important;\n}\n#testRecorderUI .header {\n  background-color: rgba(204, 250, 255, 0.9) !important;\n  padding: 2px !important;\n  line-height: 18px !important;\n  text-align: center !important;\n  position: fixed !important;\n}\n#testRecorderUI select, #testRecorderUI button {\n  padding: 1px !important;\n  margin: 1px !important;\n  height: 20px !important;\n  font-size: 12px;\n}\n#testRecorderUI #clear, #testRecorderUI #debug, #testRecorderUI .info {\n  cursor: pointer !important;\n  font-size: 13px !important;\n  padding: 2px !important;\n}\n#testRecorderUI .info {\n  float: right !important;\n}\n#testRecorderUI #generatedScript {\n  padding: 4px !important;\n  margin-top: 15px !important;\n}\n#testRecorderUI #generatedScript pre {\n  background-color: initial !important;\n  font-size: inherit !important;\n  overflow: visible !important;\n}\n\n', ''])
  }, function (t, r, u) {
    (function (f) {
      function h (A, R) {
        var T = A[1] || '', C = A[3];
        if (!C)return T;
        if (R) {
          var P = E(C), w = C.sources.map(function (S) {
            return '/*# sourceURL=' + C.sourceRoot + S + ' */'
          });
          return [T].concat(w).concat([P]).join('\n')
        }
        return [T].join('\n')
      }

      function E (A) {
        var R = new f(JSON.stringify(A)).toString('base64');
        return '/*# ' + ('sourceMappingURL=data:application/json;charset=utf-8;base64,' + R) + ' */'
      }

      t.exports = function (A) {
        var R = [];
        return R.toString = function () {
          return this.map(function (C) {
            var P = h(C, A);
            return C[2] ? '@media ' + C[2] + '{' + P + '}' : P
          }).join('')
        }, R.i = function (T, C) {
          'string' == typeof T && (T = [[null, T, '']]);
          for (var S, P = {}, w = 0; w < this.length; w++)S = this[w][0], 'number' == typeof S && (P[S] = !0);
          for (w = 0; w < T.length; w++) {
            var I = T[w];
            'number' == typeof I[0] && P[I[0]] || (C && !I[2] ? I[2] = C : C && (I[2] = '(' + I[2] + ') and (' + C + ')'), R.push(I))
          }
        }, R
      }
    }).call(r, u(5).Buffer)
  }, function (t, r) {
    r.read = function (u, f, h, E, A) {
      var R, T, C = 8 * A - E - 1, P = (1 << C) - 1, w = P >> 1, S = -7, I = h ? A - 1 : 0, O = h ? -1 : 1,
        U = u[f + I];
      for (I += O, R = U & (1 << -S) - 1, U >>= -S, S += C; 0 < S; R = 256 * R + u[f + I], I += O, S -= 8);
      for (T = R & (1 << -S) - 1, R >>= -S, S += E; 0 < S; T = 256 * T + u[f + I], I += O, S -= 8);
      if (0 === R) R = 1 - w; else {
        if (R === P)return T ? NaN : (U ? -1 : 1) * Infinity;
        T += _Mathpow(2, E), R -= w
      }
      return (U ? -1 : 1) * T * _Mathpow(2, R - E)
    }, r.write = function (u, f, h, E, A, R) {
      var T, C, P, w = 8 * R - A - 1, S = (1 << w) - 1, I = S >> 1,
        O = 23 === A ? 5.960464477539063e-8 - 6.617444900424222e-24 : 0, U = E ? 0 : R - 1, B = E ? 1 : -1,
        N = 0 > f || 0 === f && 0 > 1 / f ? 1 : 0;
      for (f = Math.abs(f), isNaN(f) || f === Infinity ? (C = isNaN(f) ? 1 : 0, T = S) : (T = _Mathfloor(Math.log(f) / Math.LN2), 1 > f * (P = _Mathpow(2, -T)) && (T--, P *= 2), f += 1 <= T + I ? O / P : O * _Mathpow(2, 1 - I), 2 <= f * P && (T++, P /= 2), T + I >= S ? (C = 0, T = S) : 1 <= T + I ? (C = (f * P - 1) * _Mathpow(2, A), T += I) : (C = f * _Mathpow(2, I - 1) * _Mathpow(2, A), T = 0)); 8 <= A; u[h + U] = 255 & C, U += B, C /= 256, A -= 8);
      for (T = T << A | C, w += A; 0 < w; u[h + U] = 255 & T, U += B, T /= 256, w -= 8);
      u[h + U - B] |= 128 * N
    }
  }, function (t) {
    var u = {}.toString;
    t.exports = Array.isArray || function (f) {
        return '[object Array]' == u.call(f)
      }
  }, function () {
    Prism.languages.javascript = Prism.languages.extend('clike', {
      keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
      number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
      'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
      operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
    }), Prism.languages.insertBefore('javascript', 'keyword', {
      regex: {
        pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
        lookbehind: !0,
        greedy: !0
      }
    }), Prism.languages.insertBefore('javascript', 'string', {
      'template-string': {
        pattern: /`(?:\\\\|\\?[^\\])*?`/,
        greedy: !0,
        inside: {
          interpolation: {
            pattern: /\$\{[^}]+\}/,
            inside: {
              'interpolation-punctuation': { pattern: /^\$\{|\}$/, alias: 'punctuation' },
              rest: Prism.languages.javascript
            }
          }, string: /[\s\S]+/
        }
      }
    }), Prism.languages.markup && Prism.languages.insertBefore('markup', 'tag', {
      script: {
        pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
        alias: 'language-javascript'
      }
    }), Prism.languages.js = Prism.languages.javascript
  }, function (t, r, u) {
    (function (f) {
      var h = 'undefined' == typeof window ? 'undefined' != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {} : window,
        E = function () {
          var A = /\blang(?:uage)?-(\w+)\b/i, R = 0, T = h.Prism = {
            util: {
              encode: function (w) {
                return w instanceof C ? new C(w.type, T.util.encode(w.content), w.alias) : 'Array' === T.util.type(w) ? w.map(T.util.encode) : w.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ')
              }, type: function (w) {
                return Object.prototype.toString.call(w).match(/\[object (\w+)\]/)[1]
              }, objId: function (w) {
                return w.__id || Object.defineProperty(w, '__id', { value: ++R }), w.__id
              }, clone: function (w) {
                var S = T.util.type(w);
                switch (S) {
                  case'Object':
                    var I = {};
                    for (var O in w)w.hasOwnProperty(O) && (I[O] = T.util.clone(w[O]));
                    return I;
                  case'Array':
                    return w.map && w.map(function (U) {
                        return T.util.clone(U)
                      });
                }
                return w
              }
            }, languages: {
              extend: function (w, S) {
                var I = T.util.clone(T.languages[w]);
                for (var O in S)I[O] = S[O];
                return I
              }, insertBefore: function (w, S, I, O) {
                O = O || T.languages;
                var U = O[w];
                if (2 == arguments.length) {
                  for (var B in I = arguments[1], I)I.hasOwnProperty(B) && (U[B] = I[B]);
                  return U
                }
                var N = {};
                for (var D in U)if (U.hasOwnProperty(D)) {
                  if (D == S)for (var B in I)I.hasOwnProperty(B) && (N[B] = I[B]);
                  N[D] = U[D]
                }
                return T.languages.DFS(T.languages, function (Y, M) {
                  M === O[w] && Y != w && (this[Y] = N)
                }), O[w] = N
              }, DFS: function (w, S, I, O) {
                for (var U in O = O || {}, w)w.hasOwnProperty(U) && (S.call(w, U, w[U], I || U), 'Object' !== T.util.type(w[U]) || O[T.util.objId(w[U])] ? 'Array' === T.util.type(w[U]) && !O[T.util.objId(w[U])] && (O[T.util.objId(w[U])] = !0, T.languages.DFS(w[U], S, U, O)) : (O[T.util.objId(w[U])] = !0, T.languages.DFS(w[U], S, null, O)))
              }
            }, plugins: {}, highlightAll: function (w, S) {
              var I = {
                callback: S,
                selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
              };
              T.hooks.run('before-highlightall', I);
              for (var B, O = I.elements || document.querySelectorAll(I.selector), U = 0; B = O[U++];)T.highlightElement(B, !0 === w, I.callback)
            }, highlightElement: function (w, S, I) {
              for (var O, U, B = w; B && !A.test(B.className);)B = B.parentNode;
              B && (O = (B.className.match(A) || [, ''])[1].toLowerCase(), U = T.languages[O]), w.className = w.className.replace(A, '').replace(/\s+/g, ' ') + ' language-' + O, B = w.parentNode, /pre/i.test(B.nodeName) && (B.className = B.className.replace(A, '').replace(/\s+/g, ' ') + ' language-' + O);
              var N = w.textContent, D = { element: w, language: O, grammar: U, code: N };
              if (T.hooks.run('before-sanity-check', D), !D.code || !D.grammar)return D.code && (D.element.textContent = D.code), void T.hooks.run('complete', D);
              if (T.hooks.run('before-highlight', D), S && h.Worker) {
                var Y = new Worker(T.filename);
                Y.onmessage = function (M) {
                  D.highlightedCode = M.data, T.hooks.run('before-insert', D), D.element.innerHTML = D.highlightedCode, I && I.call(D.element), T.hooks.run('after-highlight', D), T.hooks.run('complete', D)
                }, Y.postMessage(JSON.stringify({ language: D.language, code: D.code, immediateClose: !0 }))
              } else D.highlightedCode = T.highlight(D.code, D.grammar, D.language), T.hooks.run('before-insert', D), D.element.innerHTML = D.highlightedCode, I && I.call(w), T.hooks.run('after-highlight', D), T.hooks.run('complete', D)
            }, highlight: function (w, S, I) {
              var O = T.tokenize(w, S);
              return C.stringify(T.util.encode(O), I)
            }, tokenize: function (w, S) {
              var O = T.Token, U = [w], B = S.rest;
              if (B) {
                for (var N in B)S[N] = B[N];
                delete S.rest
              }
              tokenloop:for (var N in S)if (S.hasOwnProperty(N) && S[N]) {
                var D = S[N];
                D = 'Array' === T.util.type(D) ? D : [D];
                for (var Y = 0; Y < D.length; ++Y) {
                  var M = D[Y], G = M.inside, H = !!M.lookbehind, z = !!M.greedy, q = 0, F = M.alias;
                  if (z && !M.pattern.global) {
                    var X = M.pattern.toString().match(/[imuy]*$/)[0];
                    M.pattern = RegExp(M.pattern.source, X + 'g')
                  }
                  M = M.pattern || M;
                  for (var J, V = 0, W = 0; V < U.length; W += U[V].length, ++V) {
                    if (J = U[V], U.length > w.length)break tokenloop;
                    if (!(J instanceof O)) {
                      M.lastIndex = 0;
                      var Q = M.exec(J), Z = 1;
                      if (!Q && z && V != U.length - 1) {
                        if (M.lastIndex = W, Q = M.exec(w), !Q)break;
                        for (var K = Q.index + (H ? Q[1].length : 0), $ = Q.index + Q[0].length, ee = V, te = W, ne = U.length; ee < ne && te < $; ++ee)te += U[ee].length, K >= te && (++V, W = te);
                        if (U[V] instanceof O || U[ee - 1].greedy)continue;
                        Z = ee - V, J = w.slice(W, te), Q.index -= W
                      }
                      if (Q) {
                        H && (q = Q[1].length);
                        var K = Q.index + q, Q = Q[0].slice(q), $ = K + Q.length, re = J.slice(0, K), ae = J.slice($),
                          oe = [V, Z];
                        re && oe.push(re);
                        var ie = new O(N, G ? T.tokenize(Q, G) : Q, F, Q, z);
                        oe.push(ie), ae && oe.push(ae), Array.prototype.splice.apply(U, oe)
                      }
                    }
                  }
                }
              }
              return U
            }, hooks: {
              all: {}, add: function (w, S) {
                var I = T.hooks.all;
                I[w] = I[w] || [], I[w].push(S)
              }, run: function (w, S) {
                var I = T.hooks.all[w];
                if (I && I.length)for (var U, O = 0; U = I[O++];)U(S)
              }
            }
          }, C = T.Token = function (w, S, I, O, U) {
            this.type = w, this.content = S, this.alias = I, this.length = 0 | (O || '').length, this.greedy = !!U
          };
          if (C.stringify = function (w, S, I) {
              if ('string' == typeof w)return w;
              if ('Array' === T.util.type(w))return w.map(function (N) {
                return C.stringify(N, S, w)
              }).join('');
              var O = {
                type: w.type,
                content: C.stringify(w.content, S, I),
                tag: 'span',
                classes: ['token', w.type],
                attributes: {},
                language: S,
                parent: I
              };
              if ('comment' == O.type && (O.attributes.spellcheck = 'true'), w.alias) {
                var U = 'Array' === T.util.type(w.alias) ? w.alias : [w.alias];
                Array.prototype.push.apply(O.classes, U)
              }
              T.hooks.run('wrap', O);
              var B = Object.keys(O.attributes).map(function (N) {
                return N + '="' + (O.attributes[N] || '').replace(/"/g, '&quot;') + '"'
              }).join(' ');
              return '<' + O.tag + ' class="' + O.classes.join(' ') + '"' + (B ? ' ' + B : '') + '>' + O.content + '</' + O.tag + '>'
            }, !h.document)return h.addEventListener ? (h.addEventListener('message', function (w) {
            var S = JSON.parse(w.data), I = S.language, O = S.code, U = S.immediateClose;
            h.postMessage(T.highlight(O, T.languages[I], I)), U && h.close()
          }, !1), h.Prism) : h.Prism;
          var P = document.currentScript || [].slice.call(document.getElementsByTagName('script')).pop();
          return P && (T.filename = P.src, document.addEventListener && !P.hasAttribute('data-manual') && ('loading' === document.readyState ? document.addEventListener('DOMContentLoaded', T.highlightAll) : window.requestAnimationFrame ? window.requestAnimationFrame(T.highlightAll) : window.setTimeout(T.highlightAll, 16))), h.Prism
        }();
      'undefined' != typeof t && t.exports && (t.exports = E), 'undefined' != typeof f && (f.Prism = E), E.languages.markup = {
        comment: /<!--[\w\W]*?-->/,
        prolog: /<\?[\w\W]+?\?>/,
        doctype: /<!DOCTYPE[\w\W]+?>/i,
        cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
        tag: {
          pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
          inside: {
            tag: { pattern: /^<\/?[^\s>\/]+/i, inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ } },
            'attr-value': { pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i, inside: { punctuation: /[=>"']/ } },
            punctuation: /\/?>/,
            'attr-name': { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } }
          }
        },
        entity: /&#?[\da-z]{1,8};/i
      }, E.hooks.add('wrap', function (A) {
        'entity' === A.type && (A.attributes.title = A.content.replace(/&amp;/, '&'))
      }), E.languages.xml = E.languages.markup, E.languages.html = E.languages.markup, E.languages.mathml = E.languages.markup, E.languages.svg = E.languages.markup, E.languages.css = {
        comment: /\/\*[\w\W]*?\*\//,
        atrule: { pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i, inside: { rule: /@[\w-]+/ } },
        url: /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
        selector: /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
        string: { pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
        property: /(\b|\B)[\w-]+(?=\s*:)/i,
        important: /\B!important\b/i,
        'function': /[-a-z0-9]+(?=\()/i,
        punctuation: /[(){};:]/
      }, E.languages.css.atrule.inside.rest = E.util.clone(E.languages.css), E.languages.markup && (E.languages.insertBefore('markup', 'tag', {
        style: {
          pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
          lookbehind: !0,
          inside: E.languages.css,
          alias: 'language-css'
        }
      }), E.languages.insertBefore('inside', 'attr-value', {
        'style-attr': {
          pattern: /\s*style=("|').*?\1/i,
          inside: {
            'attr-name': { pattern: /^\s*style/i, inside: E.languages.markup.tag.inside },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            'attr-value': { pattern: /.+/i, inside: E.languages.css }
          },
          alias: 'language-css'
        }
      }, E.languages.markup.tag)), E.languages.clike = {
        comment: [{
          pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
          lookbehind: !0
        }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0 }],
        string: { pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
        'class-name': {
          pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
          lookbehind: !0,
          inside: { punctuation: /(\.|\\)/ }
        },
        keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
        boolean: /\b(true|false)\b/,
        'function': /[a-z0-9_]+(?=\()/i,
        number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
        operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
        punctuation: /[{}[\];(),.:]/
      }, E.languages.javascript = E.languages.extend('clike', {
        keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
        number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
        'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
        operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
      }), E.languages.insertBefore('javascript', 'keyword', {
        regex: {
          pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
          lookbehind: !0,
          greedy: !0
        }
      }), E.languages.insertBefore('javascript', 'string', {
        'template-string': {
          pattern: /`(?:\\\\|\\?[^\\])*?`/,
          greedy: !0,
          inside: {
            interpolation: {
              pattern: /\$\{[^}]+\}/,
              inside: {
                'interpolation-punctuation': { pattern: /^\$\{|\}$/, alias: 'punctuation' },
                rest: E.languages.javascript
              }
            }, string: /[\s\S]+/
          }
        }
      }), E.languages.markup && E.languages.insertBefore('markup', 'tag', {
        script: {
          pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
          lookbehind: !0,
          inside: E.languages.javascript,
          alias: 'language-javascript'
        }
      }), E.languages.js = E.languages.javascript, function () {
        'undefined' != typeof self && self.Prism && self.document && document.querySelector && (self.Prism.fileHighlight = function () {
          var A = {
            js: 'javascript',
            py: 'python',
            rb: 'ruby',
            ps1: 'powershell',
            psm1: 'powershell',
            sh: 'bash',
            bat: 'batch',
            h: 'c',
            tex: 'latex'
          };
          Array.prototype.forEach && Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (R) {
            for (var C, T = R.getAttribute('data-src'), P = R, w = /\blang(?:uage)?-(?!\*)(\w+)\b/i; P && !w.test(P.className);)P = P.parentNode;
            if (P && (C = (R.className.match(w) || [, ''])[1]), !C) {
              var S = (T.match(/\.(\w+)$/) || [, ''])[1];
              C = A[S] || S
            }
            var I = document.createElement('code');
            I.className = 'language-' + C, R.textContent = '', I.textContent = 'Loading\u2026', R.appendChild(I);
            var O = new XMLHttpRequest;
            O.open('GET', T, !0), O.onreadystatechange = function () {
              4 == O.readyState && (400 > O.status && O.responseText ? (I.textContent = O.responseText, E.highlightElement(I)) : 400 <= O.status ? I.textContent = '\u2716 Error ' + O.status + ' while fetching file: ' + O.statusText : I.textContent = '\u2716 Error: File does not exist or is empty')
            }, O.send(null)
          })
        }, document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight))
      }()
    }).call(r, u(3))
  }, function (t, r, u) {
    function f (z, q) {
      for (var F = 0; F < z.length; F++) {
        var X = z[F], V = O[X.id];
        if (V) {
          V.refs++;
          for (var W = 0; W < V.parts.length; W++)V.parts[W](X.parts[W]);
          for (; W < X.parts.length; W++)V.parts.push(P(X.parts[W], q))
        } else {
          for (var J = [], W = 0; W < X.parts.length; W++)J.push(P(X.parts[W], q));
          O[X.id] = { id: X.id, refs: 1, parts: J }
        }
      }
    }

    function h (z) {
      for (var q = [], F = {}, X = 0; X < z.length; X++) {
        var V = z[X], W = V[0], J = V[1], Q = V[2], Z = V[3], K = { css: J, media: Q, sourceMap: Z };
        F[W] ? F[W].parts.push(K) : q.push(F[W] = { id: W, parts: [K] })
      }
      return q
    }

    function E (z, q) {
      var F = N(z.insertInto);
      if (!F)throw new Error('Couldn\'t find a style target. This probably means that the value for the \'insertInto\' parameter is invalid.');
      var X = M[M.length - 1];
      if ('top' === z.insertAt) X ? X.nextSibling ? F.insertBefore(q, X.nextSibling) : F.appendChild(q) : F.insertBefore(q, F.firstChild), M.push(q); else if ('bottom' === z.insertAt) F.appendChild(q); else throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.')
    }

    function A (z) {
      z.parentNode.removeChild(z);
      var q = M.indexOf(z);
      0 <= q && M.splice(q, 1)
    }

    function R (z) {
      var q = document.createElement('style');
      return z.attrs.type = 'text/css', C(q, z.attrs), E(z, q), q
    }

    function T (z) {
      var q = document.createElement('link');
      return z.attrs.type = 'text/css', z.attrs.rel = 'stylesheet', C(q, z.attrs), E(z, q), q
    }

    function C (z, q) {
      Object.keys(q).forEach(function (F) {
        z.setAttribute(F, q[F])
      })
    }

    function P (z, q) {
      var F, X, V;
      if (q.singleton) {
        var W = Y++;
        F = D || (D = R(q)), X = w.bind(null, F, W, !1), V = w.bind(null, F, W, !0)
      } else z.sourceMap && 'function' == typeof URL && 'function' == typeof URL.createObjectURL && 'function' == typeof URL.revokeObjectURL && 'function' == typeof Blob && 'function' == typeof btoa ? (F = T(q), X = I.bind(null, F, q), V = function () {
        A(F), F.href && URL.revokeObjectURL(F.href)
      }) : (F = R(q), X = S.bind(null, F), V = function () {
        A(F)
      });
      return X(z), function (Q) {
        if (Q) {
          if (Q.css === z.css && Q.media === z.media && Q.sourceMap === z.sourceMap)return;
          X(z = Q)
        } else V()
      }
    }

    function w (z, q, F, X) {
      var V = F ? '' : X.css;
      if (z.styleSheet) z.styleSheet.cssText = H(q, V); else {
        var W = document.createTextNode(V), J = z.childNodes;
        J[q] && z.removeChild(J[q]), J.length ? z.insertBefore(W, J[q]) : z.appendChild(W)
      }
    }

    function S (z, q) {
      var F = q.css, X = q.media;
      if (X && z.setAttribute('media', X), z.styleSheet) z.styleSheet.cssText = F; else {
        for (; z.firstChild;)z.removeChild(z.firstChild);
        z.appendChild(document.createTextNode(F))
      }
    }

    function I (z, q, F) {
      var X = F.css, V = F.sourceMap, W = q.convertToAbsoluteUrls === void 0 && V;
      (q.convertToAbsoluteUrls || W) && (X = G(X)), V && (X += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(V)))) + ' */');
      var J = new Blob([X], { type: 'text/css' }), Q = z.href;
      z.href = URL.createObjectURL(J), Q && URL.revokeObjectURL(Q)
    }

    var O = {}, B = function (z) {
      var q;
      return function () {
        return 'undefined' == typeof q && (q = z.apply(this, arguments)), q
      }
    }(function () {
      return window && document && document.all && !window.atob
    }), N = function (z) {
      var q = {};
      return function (F) {
        return 'undefined' == typeof q[F] && (q[F] = z.call(this, F)), q[F]
      }
    }(function (z) {
      return document.querySelector(z)
    }), D = null, Y = 0, M = [], G = u(13);
    t.exports = function (z, q) {
      if ('undefined' != typeof DEBUG && DEBUG && 'object' != typeof document)throw new Error('The style-loader cannot be used in a non-browser environment');
      q = q || {}, q.attrs = 'object' == typeof q.attrs ? q.attrs : {}, 'undefined' == typeof q.singleton && (q.singleton = B()), 'undefined' == typeof q.insertInto && (q.insertInto = 'head'), 'undefined' == typeof q.insertAt && (q.insertAt = 'bottom');
      var F = h(z);
      return f(F, q), function (V) {
        for (var W = [], J = 0; J < F.length; J++) {
          var Q = F[J], Z = O[Q.id];
          Z.refs--, W.push(Z)
        }
        if (V) {
          var K = h(V);
          f(K, q)
        }
        for (var Z, J = 0; J < W.length; J++)if (Z = W[J], 0 === Z.refs) {
          for (var $ = 0; $ < Z.parts.length; $++)Z.parts[$]();
          delete O[Z.id]
        }
      }
    };
    var H = function () {
      var z = [];
      return function (q, F) {
        return z[q] = F, z.filter(Boolean).join('\n')
      }
    }()
  }, function (t) {
    t.exports = function (u) {
      var f = 'undefined' != typeof window && window.location;
      if (!f)throw new Error('fixUrls requires window.location');
      if (!u || 'string' != typeof u)return u;
      var h = f.protocol + '//' + f.host, E = h + f.pathname.replace(/\/[^\/]*$/, '/'),
        A = u.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (R, T) {
          var C = T.trim().replace(/^"(.*)"$/, function (w, S) {
            return S
          }).replace(/^'(.*)'$/, function (w, S) {
            return S
          });
          if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(C))return R;
          var P;
          return P = 0 === C.indexOf('//') ? C : 0 === C.indexOf('/') ? h + C : E + C.replace(/^\.\//, ''), 'url(' + JSON.stringify(P) + ')'
        });
      return A
    }
  }, function (t, r, u) {
    var f = u(6);
    'string' == typeof f && (f = [[t.i, f, '']]);
    u(12)(f, {});
    f.locals && (t.exports = f.locals), !1
  }, function (t, r, u) {
    'use strict';
    var f = u(2), h = u(0), E = u(1);
    r.a = class {
      constructor () {
        this.lastRoute = '', this.description = 'EMBER_CLI'
      }

      selectChange (R, T) {
        let C = T.target, P = C.selectedIndex, w = C.options[P].value, S = `
Ember.$('${R}').trigger({type:'mouseup', which:1});
andThen(function () {
${h.a.MUTATIONS_PLACEHOLDER}
});`;
        return S
      }

      clickHappened (R) {
        let T = `
click('${R}');
andThen(function () {
${h.a.MUTATIONS_PLACEHOLDER}
});`;
        return T
      }

      inputTextEdited (R, T) {
        let C = `
fillIn('${R}', '${T}')
andThen(function () {
${h.a.MUTATIONS_PLACEHOLDER}
});`;
        return C
      }

      elementAdded (R) {
        return new E.a(`#${R}`, `${f.a.indentationX2}assert.equal(find('#${R}').length, 1, '${R} shown AFTER user [INSERT REASON]');`)
      }

      elementRemoved (R) {
        return new E.a(`#${R}`, `${f.a.indentationX2}assert.equal(find('#${R}').length, 0, '${R} removed AFTER user [INSERT REASON]');`)
      }

      characterDataChanged (R) {
        let T = R.target;
        return new E.a(`#${T.parentElement.id}`, `${f.a.indentationX2}equal(find('#${T.parentElement.id}').text(), '${T.nodeValue}')`)
      }
    }
  }, function (t, r, u) {
    'use strict';
    var f = u(2), h = u(0), E = u(1);
    r.a = class {
      constructor () {
        this.lastRoute = '', this.description = 'NightWatch generator'
      }

      selectChange (R, T) {
        let C = T.target, P = C.selectedIndex, w = C.options[P].value, S = `
browser.click('${R} [value="${w}"]')
browser.pause(500)
${h.a.MUTATIONS_PLACEHOLDER}`;
        return S
      }

      clickHappened (R) {
        let T = `
browser.click('${R}')
browser.pause(500)
${h.a.MUTATIONS_PLACEHOLDER}`;
        return T
      }

      inputTextEdited (R, T) {
        let C = `
browser.setValue('${R}', '${T}')
browser.pause(500)
${h.a.MUTATIONS_PLACEHOLDER}`;
        return C
      }

      routeChanged () {
        if (this.lastRoute !== this.getCurrentRoute()) {
          let R = f.a.indentation + '.assert.equal(currentRouteName(), "' + this.getCurrentRoute() + '", "The page navigates to ' + this.getCurrentRoute() + ' on button click")<br/>';
          return R
        }
        return ''
      }

      getCurrentRoute () {
        let R = '/' === window.location.pathname, T = window.location.pathname.split('/');
        return R ? 'index' : T[1]
      }

      elementAdded (R) {
        return new E.a(`#${R}`, `browser.expect.element('#${R}').to.be.present`)
      }

      elementRemoved (R) {
        return new E.a(`#${R}`, `browser.expect.element('#${R}').to.not.be.present`)
      }

      characterDataChanged (R) {
        let T = R.target;
        return new E.a(`#${T.parentElement.id}`, `browser.assert.containsText('#${T.parentElement.id}','${T.nodeValue}')`)
      }
    }
  }, function (t, r, u) {
    'use strict';
    Object.defineProperty(r, '__esModule', { value: !0 });
    var f = u(0);
    u.d(r, 'TestRecorder', function () {
      return f.a
    })
  }, function (t, r) {
    'use strict';
    r.a = {
      filter_DoNotRecord_WhiteSpace_emberID_noID(f){
        let h = f.classList && Array.prototype.slice.call(f.classList), E = !!h && -1 !== h.indexOf('doNotRecord'),
          A = /ember[\d]+/;
        return 3 !== f.nodeType && f.id && !E && !A.test(f.id)
      }, filterDoNotRecordAndWhiteSpace(f){
        let h = f.classList && Array.prototype.slice.call(f.classList), E = !!h && -1 !== h.indexOf('doNotRecord');
        return 3 !== f.nodeType && !E
      }
    }
  }, function (t, r) {
    'use strict';
    r.a = function (h) {
      let E = document.createElement('textarea');
      E.style.position = 'fixed', E.style.top = '0', E.style.left = '0', E.style.width = '2em', E.style.height = '2em', E.style.padding = '0', E.style.border = 'none', E.style.outline = 'none', E.style.boxShadow = 'none', E.style.background = 'transparent', E.value = h, document.body.appendChild(E), E.select();
      try {
        let A = document.execCommand('copy'), R = A ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + R)
      } catch (A) {
        console.log('Oops, unable to copy')
      }
      document.body.removeChild(E)
    }
  }])
});
//# sourceMappingURL=test-recorder.js.map


chrome.runtime.onMessage.addListener(

  function (request, sender, sendResponse) {
    new TestRecorder.TestRecorder()

    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.greeting == "hello") {
      sendResponse({ farewell: "goodbye" });
    }
  });
