/** @returns {void} */
function noop() {}

/**
 * @template T
 * @template S
 * @param {T} tar
 * @param {S} src
 * @returns {T & S}
 */
function assign(tar, src) {
	// @ts-ignore
	for (const k in src) tar[k] = src[k];
	return /** @type {T & S} */ (tar);
}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

function create_slot(definition, ctx, $$scope, fn) {
	if (definition) {
		const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
		return definition[0](slot_ctx);
	}
}

function get_slot_context(definition, ctx, $$scope, fn) {
	return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}

function get_slot_changes(definition, $$scope, dirty, fn) {
	if (definition[2] && fn) {
		const lets = definition[2](fn(dirty));
		if ($$scope.dirty === undefined) {
			return lets;
		}
		if (typeof lets === 'object') {
			const merged = [];
			const len = Math.max($$scope.dirty.length, lets.length);
			for (let i = 0; i < len; i += 1) {
				merged[i] = $$scope.dirty[i] | lets[i];
			}
			return merged;
		}
		return $$scope.dirty | lets;
	}
	return $$scope.dirty;
}

/** @returns {void} */
function update_slot_base(
	slot,
	slot_definition,
	ctx,
	$$scope,
	slot_changes,
	get_slot_context_fn
) {
	if (slot_changes) {
		const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
		slot.p(slot_context, slot_changes);
	}
}

/** @returns {any[] | -1} */
function get_all_dirty_from_scope($$scope) {
	if ($$scope.ctx.length > 32) {
		const dirty = [];
		const length = $$scope.ctx.length / 32;
		for (let i = 0; i < length; i++) {
			dirty[i] = -1;
		}
		return dirty;
	}
	return -1;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @template {keyof SVGElementTagNameMap} K
 * @param {K} name
 * @returns {SVGElement}
 */
function svg_element(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @returns {Text} */
function empty() {
	return text('');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @returns {void} */
function set_style(node, key, value, important) {
	if (value == null) {
		node.style.removeProperty(key);
	} else {
		node.style.setProperty(key, value, important ? 'important' : '');
	}
}

/**
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
}

function construct_svelte_component(component, props) {
	return new component(props);
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

/** @returns {void} */
function add_flush_callback(fn) {
	flush_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @type {Outro}
 */
let outros;

/**
 * @returns {void} */
function group_outros() {
	outros = {
		r: 0,
		c: [],
		p: outros // parent group
	};
}

/**
 * @returns {void} */
function check_outros() {
	if (!outros.r) {
		run_all(outros.c);
	}
	outros = outros.p;
}

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} local
 * @param {0 | 1} [detach]
 * @param {() => void} [callback]
 * @returns {void}
 */
function transition_out(block, local, detach, callback) {
	if (block && block.o) {
		if (outroing.has(block)) return;
		outroing.add(block);
		outros.c.push(() => {
			outroing.delete(block);
			if (callback) {
				if (detach) block.d(1);
				callback();
			}
		});
		block.o(local);
	} else if (callback) {
		callback();
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

/** @returns {void} */
function bind(component, name, callback) {
	const index = component.$$.props[name];
	if (index !== undefined) {
		component.$$.bound[index] = callback;
		callback(component.$$.ctx[index]);
	}
}

/** @returns {void} */
function create_component(block) {
	block && block.c();
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const parseNumber = parseFloat;

function joinCss(obj, separator = ';') {
  let texts;
  if (Array.isArray(obj)) {
    texts = obj.filter((text) => text);
  } else {
    texts = [];
    for (const prop in obj) {
      if (obj[prop]) {
        texts.push(`${prop}:${obj[prop]}`);
      }
    }
  }
  return texts.join(separator);
}

function getStyles(style, size, pull, fw) {
  let float;
  let width;
  const height = '1em';
  let lineHeight;
  let fontSize;
  let textAlign;
  let verticalAlign = '-.125em';
  const overflow = 'visible';

  if (fw) {
    textAlign = 'center';
    width = '1.25em';
  }

  if (pull) {
    float = pull;
  }

  if (size) {
    if (size == 'lg') {
      fontSize = '1.33333em';
      lineHeight = '.75em';
      verticalAlign = '-.225em';
    } else if (size == 'xs') {
      fontSize = '.75em';
    } else if (size == 'sm') {
      fontSize = '.875em';
    } else {
      fontSize = size.replace('x', 'em');
    }
  }

  return joinCss([
    joinCss({
      float,
      width,
      height,
      'line-height': lineHeight,
      'font-size': fontSize,
      'text-align': textAlign,
      'vertical-align': verticalAlign,
      'transform-origin': 'center',
      overflow,
    }),
    style,
  ]);
}

function getTransform(
  scale,
  translateX,
  translateY,
  rotate,
  flip,
  translateTimes = 1,
  translateUnit = '',
  rotateUnit = '',
) {
  let flipX = 1;
  let flipY = 1;

  if (flip) {
    if (flip == 'horizontal') {
      flipX = -1;
    } else if (flip == 'vertical') {
      flipY = -1;
    } else {
      flipX = flipY = -1;
    }
  }

  return joinCss(
    [
      `translate(${parseNumber(translateX) * translateTimes}${translateUnit},${parseNumber(translateY) * translateTimes}${translateUnit})`,
      `scale(${flipX * parseNumber(scale)},${flipY * parseNumber(scale)})`,
      rotate && `rotate(${rotate}${rotateUnit})`,
    ],
    ' ',
  );
}

/* node_modules/svelte-fa/src/fa.svelte generated by Svelte v4.2.1 */

function create_if_block$1(ctx) {
	let svg;
	let g1;
	let g0;
	let g1_transform_value;
	let g1_transform_origin_value;
	let svg_id_value;
	let svg_class_value;
	let svg_viewBox_value;

	function select_block_type(ctx, dirty) {
		if (typeof /*i*/ ctx[10][4] == 'string') return create_if_block_1;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			svg = svg_element("svg");
			g1 = svg_element("g");
			g0 = svg_element("g");
			if_block.c();
			attr(g0, "transform", /*transform*/ ctx[12]);
			attr(g1, "transform", g1_transform_value = "translate(" + /*i*/ ctx[10][0] / 2 + " " + /*i*/ ctx[10][1] / 2 + ")");
			attr(g1, "transform-origin", g1_transform_origin_value = "" + (/*i*/ ctx[10][0] / 4 + " 0"));
			attr(svg, "id", svg_id_value = /*id*/ ctx[1] || undefined);
			attr(svg, "class", svg_class_value = "svelte-fa " + /*clazz*/ ctx[0] + " svelte-1cj2gr0");
			attr(svg, "style", /*s*/ ctx[11]);
			attr(svg, "viewBox", svg_viewBox_value = "0 0 " + /*i*/ ctx[10][0] + " " + /*i*/ ctx[10][1]);
			attr(svg, "aria-hidden", "true");
			attr(svg, "role", "img");
			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
			toggle_class(svg, "pulse", /*pulse*/ ctx[4]);
			toggle_class(svg, "spin", /*spin*/ ctx[3]);
		},
		m(target, anchor) {
			insert(target, svg, anchor);
			append(svg, g1);
			append(g1, g0);
			if_block.m(g0, null);
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(g0, null);
				}
			}

			if (dirty & /*transform*/ 4096) {
				attr(g0, "transform", /*transform*/ ctx[12]);
			}

			if (dirty & /*i*/ 1024 && g1_transform_value !== (g1_transform_value = "translate(" + /*i*/ ctx[10][0] / 2 + " " + /*i*/ ctx[10][1] / 2 + ")")) {
				attr(g1, "transform", g1_transform_value);
			}

			if (dirty & /*i*/ 1024 && g1_transform_origin_value !== (g1_transform_origin_value = "" + (/*i*/ ctx[10][0] / 4 + " 0"))) {
				attr(g1, "transform-origin", g1_transform_origin_value);
			}

			if (dirty & /*id*/ 2 && svg_id_value !== (svg_id_value = /*id*/ ctx[1] || undefined)) {
				attr(svg, "id", svg_id_value);
			}

			if (dirty & /*clazz*/ 1 && svg_class_value !== (svg_class_value = "svelte-fa " + /*clazz*/ ctx[0] + " svelte-1cj2gr0")) {
				attr(svg, "class", svg_class_value);
			}

			if (dirty & /*s*/ 2048) {
				attr(svg, "style", /*s*/ ctx[11]);
			}

			if (dirty & /*i*/ 1024 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*i*/ ctx[10][0] + " " + /*i*/ ctx[10][1])) {
				attr(svg, "viewBox", svg_viewBox_value);
			}

			if (dirty & /*clazz, pulse*/ 17) {
				toggle_class(svg, "pulse", /*pulse*/ ctx[4]);
			}

			if (dirty & /*clazz, spin*/ 9) {
				toggle_class(svg, "spin", /*spin*/ ctx[3]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(svg);
			}

			if_block.d();
		}
	};
}

// (89:8) {:else}
function create_else_block$1(ctx) {
	let path0;
	let path0_d_value;
	let path0_fill_value;
	let path0_fill_opacity_value;
	let path0_transform_value;
	let path1;
	let path1_d_value;
	let path1_fill_value;
	let path1_fill_opacity_value;
	let path1_transform_value;

	return {
		c() {
			path0 = svg_element("path");
			path1 = svg_element("path");
			attr(path0, "d", path0_d_value = /*i*/ ctx[10][4][0]);
			attr(path0, "fill", path0_fill_value = /*secondaryColor*/ ctx[6] || /*color*/ ctx[2] || 'currentColor');

			attr(path0, "fill-opacity", path0_fill_opacity_value = /*swapOpacity*/ ctx[9] != false
			? /*primaryOpacity*/ ctx[7]
			: /*secondaryOpacity*/ ctx[8]);

			attr(path0, "transform", path0_transform_value = "translate(" + /*i*/ ctx[10][0] / -2 + " " + /*i*/ ctx[10][1] / -2 + ")");
			attr(path1, "d", path1_d_value = /*i*/ ctx[10][4][1]);
			attr(path1, "fill", path1_fill_value = /*primaryColor*/ ctx[5] || /*color*/ ctx[2] || 'currentColor');

			attr(path1, "fill-opacity", path1_fill_opacity_value = /*swapOpacity*/ ctx[9] != false
			? /*secondaryOpacity*/ ctx[8]
			: /*primaryOpacity*/ ctx[7]);

			attr(path1, "transform", path1_transform_value = "translate(" + /*i*/ ctx[10][0] / -2 + " " + /*i*/ ctx[10][1] / -2 + ")");
		},
		m(target, anchor) {
			insert(target, path0, anchor);
			insert(target, path1, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*i*/ 1024 && path0_d_value !== (path0_d_value = /*i*/ ctx[10][4][0])) {
				attr(path0, "d", path0_d_value);
			}

			if (dirty & /*secondaryColor, color*/ 68 && path0_fill_value !== (path0_fill_value = /*secondaryColor*/ ctx[6] || /*color*/ ctx[2] || 'currentColor')) {
				attr(path0, "fill", path0_fill_value);
			}

			if (dirty & /*swapOpacity, primaryOpacity, secondaryOpacity*/ 896 && path0_fill_opacity_value !== (path0_fill_opacity_value = /*swapOpacity*/ ctx[9] != false
			? /*primaryOpacity*/ ctx[7]
			: /*secondaryOpacity*/ ctx[8])) {
				attr(path0, "fill-opacity", path0_fill_opacity_value);
			}

			if (dirty & /*i*/ 1024 && path0_transform_value !== (path0_transform_value = "translate(" + /*i*/ ctx[10][0] / -2 + " " + /*i*/ ctx[10][1] / -2 + ")")) {
				attr(path0, "transform", path0_transform_value);
			}

			if (dirty & /*i*/ 1024 && path1_d_value !== (path1_d_value = /*i*/ ctx[10][4][1])) {
				attr(path1, "d", path1_d_value);
			}

			if (dirty & /*primaryColor, color*/ 36 && path1_fill_value !== (path1_fill_value = /*primaryColor*/ ctx[5] || /*color*/ ctx[2] || 'currentColor')) {
				attr(path1, "fill", path1_fill_value);
			}

			if (dirty & /*swapOpacity, secondaryOpacity, primaryOpacity*/ 896 && path1_fill_opacity_value !== (path1_fill_opacity_value = /*swapOpacity*/ ctx[9] != false
			? /*secondaryOpacity*/ ctx[8]
			: /*primaryOpacity*/ ctx[7])) {
				attr(path1, "fill-opacity", path1_fill_opacity_value);
			}

			if (dirty & /*i*/ 1024 && path1_transform_value !== (path1_transform_value = "translate(" + /*i*/ ctx[10][0] / -2 + " " + /*i*/ ctx[10][1] / -2 + ")")) {
				attr(path1, "transform", path1_transform_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(path0);
				detach(path1);
			}
		}
	};
}

// (83:8) {#if typeof i[4] == 'string'}
function create_if_block_1(ctx) {
	let path;
	let path_d_value;
	let path_fill_value;
	let path_transform_value;

	return {
		c() {
			path = svg_element("path");
			attr(path, "d", path_d_value = /*i*/ ctx[10][4]);
			attr(path, "fill", path_fill_value = /*color*/ ctx[2] || /*primaryColor*/ ctx[5] || 'currentColor');
			attr(path, "transform", path_transform_value = "translate(" + /*i*/ ctx[10][0] / -2 + " " + /*i*/ ctx[10][1] / -2 + ")");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*i*/ 1024 && path_d_value !== (path_d_value = /*i*/ ctx[10][4])) {
				attr(path, "d", path_d_value);
			}

			if (dirty & /*color, primaryColor*/ 36 && path_fill_value !== (path_fill_value = /*color*/ ctx[2] || /*primaryColor*/ ctx[5] || 'currentColor')) {
				attr(path, "fill", path_fill_value);
			}

			if (dirty & /*i*/ 1024 && path_transform_value !== (path_transform_value = "translate(" + /*i*/ ctx[10][0] / -2 + " " + /*i*/ ctx[10][1] / -2 + ")")) {
				attr(path, "transform", path_transform_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(path);
			}
		}
	};
}

function create_fragment$a(ctx) {
	let if_block_anchor;
	let if_block = /*i*/ ctx[10][4] && create_if_block$1(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, [dirty]) {
			if (/*i*/ ctx[10][4]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
		}
	};
}

function instance$9($$self, $$props, $$invalidate) {
	let { class: clazz = '' } = $$props;
	let { id = '' } = $$props;
	let { style = '' } = $$props;
	let { icon } = $$props;
	let { size = '' } = $$props;
	let { color = '' } = $$props;
	let { fw = false } = $$props;
	let { pull = '' } = $$props;
	let { scale = 1 } = $$props;
	let { translateX = 0 } = $$props;
	let { translateY = 0 } = $$props;
	let { rotate = '' } = $$props;
	let { flip = false } = $$props;
	let { spin = false } = $$props;
	let { pulse = false } = $$props;
	let { primaryColor = '' } = $$props;
	let { secondaryColor = '' } = $$props;
	let { primaryOpacity = 1 } = $$props;
	let { secondaryOpacity = 0.4 } = $$props;
	let { swapOpacity = false } = $$props;
	let i;
	let s;
	let transform;

	$$self.$$set = $$props => {
		if ('class' in $$props) $$invalidate(0, clazz = $$props.class);
		if ('id' in $$props) $$invalidate(1, id = $$props.id);
		if ('style' in $$props) $$invalidate(13, style = $$props.style);
		if ('icon' in $$props) $$invalidate(14, icon = $$props.icon);
		if ('size' in $$props) $$invalidate(15, size = $$props.size);
		if ('color' in $$props) $$invalidate(2, color = $$props.color);
		if ('fw' in $$props) $$invalidate(16, fw = $$props.fw);
		if ('pull' in $$props) $$invalidate(17, pull = $$props.pull);
		if ('scale' in $$props) $$invalidate(18, scale = $$props.scale);
		if ('translateX' in $$props) $$invalidate(19, translateX = $$props.translateX);
		if ('translateY' in $$props) $$invalidate(20, translateY = $$props.translateY);
		if ('rotate' in $$props) $$invalidate(21, rotate = $$props.rotate);
		if ('flip' in $$props) $$invalidate(22, flip = $$props.flip);
		if ('spin' in $$props) $$invalidate(3, spin = $$props.spin);
		if ('pulse' in $$props) $$invalidate(4, pulse = $$props.pulse);
		if ('primaryColor' in $$props) $$invalidate(5, primaryColor = $$props.primaryColor);
		if ('secondaryColor' in $$props) $$invalidate(6, secondaryColor = $$props.secondaryColor);
		if ('primaryOpacity' in $$props) $$invalidate(7, primaryOpacity = $$props.primaryOpacity);
		if ('secondaryOpacity' in $$props) $$invalidate(8, secondaryOpacity = $$props.secondaryOpacity);
		if ('swapOpacity' in $$props) $$invalidate(9, swapOpacity = $$props.swapOpacity);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*icon*/ 16384) {
			$$invalidate(10, i = icon && icon.icon || [0, 0, '', [], '']);
		}

		if ($$self.$$.dirty & /*style, size, pull, fw*/ 237568) {
			$$invalidate(11, s = getStyles(style, size, pull, fw));
		}

		if ($$self.$$.dirty & /*scale, translateX, translateY, rotate, flip*/ 8126464) {
			$$invalidate(12, transform = getTransform(scale, translateX, translateY, rotate, flip, 512));
		}
	};

	return [
		clazz,
		id,
		color,
		spin,
		pulse,
		primaryColor,
		secondaryColor,
		primaryOpacity,
		secondaryOpacity,
		swapOpacity,
		i,
		s,
		transform,
		style,
		icon,
		size,
		fw,
		pull,
		scale,
		translateX,
		translateY,
		rotate,
		flip
	];
}

class Fa extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$9, create_fragment$a, safe_not_equal, {
			class: 0,
			id: 1,
			style: 13,
			icon: 14,
			size: 15,
			color: 2,
			fw: 16,
			pull: 17,
			scale: 18,
			translateX: 19,
			translateY: 20,
			rotate: 21,
			flip: 22,
			spin: 3,
			pulse: 4,
			primaryColor: 5,
			secondaryColor: 6,
			primaryOpacity: 7,
			secondaryOpacity: 8,
			swapOpacity: 9
		});
	}
}

var Fa$1 = Fa;

var faChartPie = {
  prefix: 'fas',
  iconName: 'chart-pie',
  icon: [576, 512, ["pie-chart"], "f200", "M304 240V16.6c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16H304zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4V288L412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288H558.4z"]
};
var faChartLine = {
  prefix: 'fas',
  iconName: 'chart-line',
  icon: [512, 512, ["line-chart"], "f201", "M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"]
};
var faHouse = {
  prefix: 'fas',
  iconName: 'house',
  icon: [576, 512, [127968, 63498, 63500, "home", "home-alt", "home-lg-alt"], "f015", "M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"]
};
var faChartColumn = {
  prefix: 'fas',
  iconName: 'chart-column',
  icon: [512, 512, [], "e0e3", "M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z"]
};

/* src/components/HL.svelte generated by Svelte v4.2.1 */

function create_fragment$9(ctx) {
	let span;
	let span_class_value;
	let current;
	const default_slot_template = /*#slots*/ ctx[2].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

	return {
		c() {
			span = element("span");
			if (default_slot) default_slot.c();
			attr(span, "class", span_class_value = "has-background-" + /*c*/ ctx[0]);
			toggle_class(span, "has-text-white", /*c*/ ctx[0] != 'warning');
		},
		m(target, anchor) {
			insert(target, span, anchor);

			if (default_slot) {
				default_slot.m(span, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[1],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*c*/ 1 && span_class_value !== (span_class_value = "has-background-" + /*c*/ ctx[0])) {
				attr(span, "class", span_class_value);
			}

			if (!current || dirty & /*c, c*/ 1) {
				toggle_class(span, "has-text-white", /*c*/ ctx[0] != 'warning');
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}

			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance$8($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { c = 'warning' } = $$props;

	$$self.$$set = $$props => {
		if ('c' in $$props) $$invalidate(0, c = $$props.c);
		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
	};

	return [c, $$scope, slots];
}

class HL extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$8, create_fragment$9, safe_not_equal, { c: 0 });
	}
}

/* src/pages/Home.svelte generated by Svelte v4.2.1 */

function create_default_slot_7$1(ctx) {
	let t;

	return {
		c() {
			t = text("Svelte");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (28:7) <HL>
function create_default_slot_6$1(ctx) {
	let t;

	return {
		c() {
			t = text("Svelte");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (31:13) <HL>
function create_default_slot_5$2(ctx) {
	let t;

	return {
		c() {
			t = text("Bulma");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (32:7) <HL>
function create_default_slot_4$3(ctx) {
	let t;

	return {
		c() {
			t = text("Svelte Preprocessor");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (35:3) <HL>
function create_default_slot_3$3(ctx) {
	let t;

	return {
		c() {
			t = text("Rollup");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (35:47) <HL>
function create_default_slot_2$3(ctx) {
	let t;

	return {
		c() {
			t = text(".json");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (35:62) <HL>
function create_default_slot_1$3(ctx) {
	let t;

	return {
		c() {
			t = text(".csv");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (35:76) <HL>
function create_default_slot$3(ctx) {
	let t;

	return {
		c() {
			t = text(".ts");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

function create_fragment$8(ctx) {
	let div5;
	let t16;
	let div6;
	let p3;
	let t17;
	let hl0;
	let t18;
	let hl1;
	let t19;
	let t20;
	let p4;
	let t21;
	let hl2;
	let t22;
	let hl3;
	let t23;
	let t24;
	let p5;
	let t25;
	let hl4;
	let t26;
	let hl5;
	let t27;
	let hl6;
	let t28;
	let hl7;
	let t29;
	let t30;
	let p6;
	let current;

	hl0 = new HL({
			props: {
				$$slots: { default: [create_default_slot_7$1] },
				$$scope: { ctx }
			}
		});

	hl1 = new HL({
			props: {
				$$slots: { default: [create_default_slot_6$1] },
				$$scope: { ctx }
			}
		});

	hl2 = new HL({
			props: {
				$$slots: { default: [create_default_slot_5$2] },
				$$scope: { ctx }
			}
		});

	hl3 = new HL({
			props: {
				$$slots: { default: [create_default_slot_4$3] },
				$$scope: { ctx }
			}
		});

	hl4 = new HL({
			props: {
				$$slots: { default: [create_default_slot_3$3] },
				$$scope: { ctx }
			}
		});

	hl5 = new HL({
			props: {
				$$slots: { default: [create_default_slot_2$3] },
				$$scope: { ctx }
			}
		});

	hl6 = new HL({
			props: {
				$$slots: { default: [create_default_slot_1$3] },
				$$scope: { ctx }
			}
		});

	hl7 = new HL({
			props: {
				$$slots: { default: [create_default_slot$3] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			div5 = element("div");
			div5.innerHTML = `<div class="column"><div class="card svelte-18mgsv1"><div class="card-content"><p class="title">張信富</p> <p class="subtitle">資工二B</p> <p class="subtitle">111502551</p></div></div></div> <div class="column"><div class="content"><ul><li>Svelte -- 方便模組化設計與編排</li> <li>Bulma -- css framework</li> <li>Rollup -- 打包</li> <li>Github Action -- 線上Build到指定的分支並部署到Github Pages</li> <li>... 剩餘的請看<a href="https://github.com/vyytx/dataViz/blob/main/package.json">這裡</a></li></ul></div></div>`;
			t16 = space();
			div6 = element("div");
			p3 = element("p");
			t17 = text("首先，因為我以");
			create_component(hl0.$$.fragment);
			t18 = text("重寫了整個摸版，所以看起來會跟模板有些不同。\n\t\t因為這樣就不會有需要把所有東西寫在同一個緊湊的HTML檔內的問題，也能更加靈活的調用js以控制網頁的變化，因此我覺得將整份模板改寫是方便開發的。\n\t\t另外，由於");
			create_component(hl1.$$.fragment);
			t19 = text("提供的功能更像是一個編譯器，所以隨後就可以產出一個通用的.js檔，來控制網頁。");
			t20 = space();
			p4 = element("p");
			t21 = text("在樣式設計上，我引入了");
			create_component(hl2.$$.fragment);
			t22 = text("這個pure css framework來做絕大多數的設計。當然，小部分還是有自己寫的scss\n\t\t，之後交給");
			create_component(hl3.$$.fragment);
			t23 = text("跟Rollup 打包成一個通用的css檔。");
			t24 = space();
			p5 = element("p");
			t25 = text("而");
			create_component(hl4.$$.fragment);
			t26 = text("作為一個打包工具，處理.svelte檔匯入的其他檔案，諸如");
			create_component(hl5.$$.fragment);
			t27 = text("、");
			create_component(hl6.$$.fragment);
			t28 = text("、");
			create_component(hl7.$$.fragment);
			t29 = text("等等。\n\t\t另外當整個打包流程都結束後，控制著輸出。");
			t30 = space();
			p6 = element("p");
			p6.innerHTML = `最後，我使用了<a href="https://github.com/JamesIves/github-pages-deploy-action">JamesIves設計的Action</a>來部署到Github Pages。`;
			attr(div5, "class", "columns");
			attr(div6, "class", "content is-medium pt-4");
		},
		m(target, anchor) {
			insert(target, div5, anchor);
			insert(target, t16, anchor);
			insert(target, div6, anchor);
			append(div6, p3);
			append(p3, t17);
			mount_component(hl0, p3, null);
			append(p3, t18);
			mount_component(hl1, p3, null);
			append(p3, t19);
			append(div6, t20);
			append(div6, p4);
			append(p4, t21);
			mount_component(hl2, p4, null);
			append(p4, t22);
			mount_component(hl3, p4, null);
			append(p4, t23);
			append(div6, t24);
			append(div6, p5);
			append(p5, t25);
			mount_component(hl4, p5, null);
			append(p5, t26);
			mount_component(hl5, p5, null);
			append(p5, t27);
			mount_component(hl6, p5, null);
			append(p5, t28);
			mount_component(hl7, p5, null);
			append(p5, t29);
			append(div6, t30);
			append(div6, p6);
			current = true;
		},
		p(ctx, [dirty]) {
			const hl0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl0_changes.$$scope = { dirty, ctx };
			}

			hl0.$set(hl0_changes);
			const hl1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl1_changes.$$scope = { dirty, ctx };
			}

			hl1.$set(hl1_changes);
			const hl2_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl2_changes.$$scope = { dirty, ctx };
			}

			hl2.$set(hl2_changes);
			const hl3_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl3_changes.$$scope = { dirty, ctx };
			}

			hl3.$set(hl3_changes);
			const hl4_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl4_changes.$$scope = { dirty, ctx };
			}

			hl4.$set(hl4_changes);
			const hl5_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl5_changes.$$scope = { dirty, ctx };
			}

			hl5.$set(hl5_changes);
			const hl6_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl6_changes.$$scope = { dirty, ctx };
			}

			hl6.$set(hl6_changes);
			const hl7_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl7_changes.$$scope = { dirty, ctx };
			}

			hl7.$set(hl7_changes);
		},
		i(local) {
			if (current) return;
			transition_in(hl0.$$.fragment, local);
			transition_in(hl1.$$.fragment, local);
			transition_in(hl2.$$.fragment, local);
			transition_in(hl3.$$.fragment, local);
			transition_in(hl4.$$.fragment, local);
			transition_in(hl5.$$.fragment, local);
			transition_in(hl6.$$.fragment, local);
			transition_in(hl7.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hl0.$$.fragment, local);
			transition_out(hl1.$$.fragment, local);
			transition_out(hl2.$$.fragment, local);
			transition_out(hl3.$$.fragment, local);
			transition_out(hl4.$$.fragment, local);
			transition_out(hl5.$$.fragment, local);
			transition_out(hl6.$$.fragment, local);
			transition_out(hl7.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div5);
				detach(t16);
				detach(div6);
			}

			destroy_component(hl0);
			destroy_component(hl1);
			destroy_component(hl2);
			destroy_component(hl3);
			destroy_component(hl4);
			destroy_component(hl5);
			destroy_component(hl6);
			destroy_component(hl7);
		}
	};
}

class Home extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment$8, safe_not_equal, {});
	}
}

var trace1$1={mode:"markers+text",type:"scatter",name:"Team A",marker:{size:10},dots:[[1,10,"A1"],[2,15,"A2"],[3,13,"A3"],[4,17,"A4"]],textposition:"bottom center",textfont:{family:"Raleway, sans-serif",size:10}};var trace2$1={mode:"lines+text",type:"scatter",name:"Team B",dots:[[2,6," B1"],[3,9," B2"],[5,20," B3"],[6,5," B4"]],textposition:"middle right",textfont:{family:"Consolas",size:12}};var trace3$1={visible:true,mode:"lines+markers",type:"scatter",name:"Team C",marker:{size:10},dots:[[1,2,"C1"],[3,4,"C2"],[5,8,"C3"],[7,10,"C4"]]};var dataJSON$1 = {trace1:trace1$1,trace2:trace2$1,trace3:trace3$1};

/* src/pages/HW1.svelte generated by Svelte v4.2.1 */

function create_default_slot_5$1(ctx) {
	let t;

	return {
		c() {
			t = text("A隊");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (44:2) <HL>
function create_default_slot_4$2(ctx) {
	let t;

	return {
		c() {
			t = text("B隊");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (45:2) <HL>
function create_default_slot_3$2(ctx) {
	let t;

	return {
		c() {
			t = text("C隊");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (52:4) <HL>
function create_default_slot_2$2(ctx) {
	let t;

	return {
		c() {
			t = text("A隊");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (53:3) <HL>
function create_default_slot_1$2(ctx) {
	let t;

	return {
		c() {
			t = text("B隊");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (55:8) <HL>
function create_default_slot$2(ctx) {
	let t;

	return {
		c() {
			t = text("C隊");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

function create_fragment$7(ctx) {
	let div0;
	let t0;
	let div1;
	let h1;
	let t2;
	let p0;
	let t3;
	let br0;
	let t4;
	let hl0;
	let t5;
	let br1;
	let t6;
	let hl1;
	let t7;
	let br2;
	let t8;
	let hl2;
	let t9;
	let t10;
	let p1;
	let t12;
	let p2;
	let t13;
	let hl3;
	let t14;
	let hl4;
	let t15;
	let hl5;
	let t16;
	let current;

	hl0 = new HL({
			props: {
				$$slots: { default: [create_default_slot_5$1] },
				$$scope: { ctx }
			}
		});

	hl1 = new HL({
			props: {
				$$slots: { default: [create_default_slot_4$2] },
				$$scope: { ctx }
			}
		});

	hl2 = new HL({
			props: {
				$$slots: { default: [create_default_slot_3$2] },
				$$scope: { ctx }
			}
		});

	hl3 = new HL({
			props: {
				$$slots: { default: [create_default_slot_2$2] },
				$$scope: { ctx }
			}
		});

	hl4 = new HL({
			props: {
				$$slots: { default: [create_default_slot_1$2] },
				$$scope: { ctx }
			}
		});

	hl5 = new HL({
			props: {
				$$slots: { default: [create_default_slot$2] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			div0 = element("div");
			t0 = space();
			div1 = element("div");
			h1 = element("h1");
			h1.textContent = "作業1 折線圖與散佈圖";
			t2 = space();
			p0 = element("p");
			t3 = text("以上圖表分別以散佈圖、純折線圖與有標記資料點的折線圖來表現三組隊伍在1~7月得分的假資料。");
			br0 = element("br");
			t4 = space();
			create_component(hl0.$$.fragment);
			t5 = text("只有在前四個月有得分，依序是10、15、13、17分。");
			br1 = element("br");
			t6 = space();
			create_component(hl1.$$.fragment);
			t7 = text("則是分別在2、3、5、6月得了6、9、20、5分。");
			br2 = element("br");
			t8 = space();
			create_component(hl2.$$.fragment);
			t9 = text("則是在1、3、5、7月得了2、4、8、10分。");
			t10 = space();
			p1 = element("p");
			p1.textContent = "利用Plotly.js作圖後，我們可以很清楚地看到各隊得分數變化的趨勢，這也是使用散佈圖或折線圖呈現的好處。\n\t\t另外，使用散佈圖或折線圖，也可以很簡單地將回歸分析的結果納入圖中而不需要去擔心座標軸的問題。";
			t12 = space();
			p2 = element("p");
			t13 = text("對於");
			create_component(hl3.$$.fragment);
			t14 = text("的線（或實際上不能叫做線，可能可以稱作點集合），我們將點的名稱列在該點的上方。\n\t\t而");
			create_component(hl4.$$.fragment);
			t15 = text("的線，一開始為了練習單純的無裝飾的Line Chart，並沒有特別把點標出來。\n\t\t不過後來在整理時，資料點的位置實在不夠清楚。因此在每個資料點右側標上了該點的名稱，以方便認出點的位置。\n\t\t最後我們看向");
			create_component(hl5.$$.fragment);
			t16 = text("的線，這是一個有標點的折線圖，雖然這條線不會直接將名稱寫在旁邊，但由於有在資料點上加畫一個點，所以仍能容易地找到位置。");
			attr(div0, "id", "myGraph");
			attr(div0, "class", "graph");
			attr(div1, "class", "content is-medium pt-4");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t0, anchor);
			insert(target, div1, anchor);
			append(div1, h1);
			append(div1, t2);
			append(div1, p0);
			append(p0, t3);
			append(p0, br0);
			append(p0, t4);
			mount_component(hl0, p0, null);
			append(p0, t5);
			append(p0, br1);
			append(p0, t6);
			mount_component(hl1, p0, null);
			append(p0, t7);
			append(p0, br2);
			append(p0, t8);
			mount_component(hl2, p0, null);
			append(p0, t9);
			append(div1, t10);
			append(div1, p1);
			append(div1, t12);
			append(div1, p2);
			append(p2, t13);
			mount_component(hl3, p2, null);
			append(p2, t14);
			mount_component(hl4, p2, null);
			append(p2, t15);
			mount_component(hl5, p2, null);
			append(p2, t16);
			current = true;
		},
		p(ctx, [dirty]) {
			const hl0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl0_changes.$$scope = { dirty, ctx };
			}

			hl0.$set(hl0_changes);
			const hl1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl1_changes.$$scope = { dirty, ctx };
			}

			hl1.$set(hl1_changes);
			const hl2_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl2_changes.$$scope = { dirty, ctx };
			}

			hl2.$set(hl2_changes);
			const hl3_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl3_changes.$$scope = { dirty, ctx };
			}

			hl3.$set(hl3_changes);
			const hl4_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl4_changes.$$scope = { dirty, ctx };
			}

			hl4.$set(hl4_changes);
			const hl5_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl5_changes.$$scope = { dirty, ctx };
			}

			hl5.$set(hl5_changes);
		},
		i(local) {
			if (current) return;
			transition_in(hl0.$$.fragment, local);
			transition_in(hl1.$$.fragment, local);
			transition_in(hl2.$$.fragment, local);
			transition_in(hl3.$$.fragment, local);
			transition_in(hl4.$$.fragment, local);
			transition_in(hl5.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hl0.$$.fragment, local);
			transition_out(hl1.$$.fragment, local);
			transition_out(hl2.$$.fragment, local);
			transition_out(hl3.$$.fragment, local);
			transition_out(hl4.$$.fragment, local);
			transition_out(hl5.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t0);
				detach(div1);
			}

			destroy_component(hl0);
			destroy_component(hl1);
			destroy_component(hl2);
			destroy_component(hl3);
			destroy_component(hl4);
			destroy_component(hl5);
		}
	};
}

function instance$7($$self) {
	onMount(async () => {
		const Plotly = await import('./plotly.min-aa68bb7b.js').then(function (n) { return n.p; });

		const data = Object.values(dataJSON$1).map(trace => {
			trace['x'] = [];
			trace['y'] = [];
			trace['text'] = [];

			trace['dots'].forEach(v => {
				trace['x'].push(v[0]);
				trace['y'].push(v[1]);
				trace['text'].push(v[2]);
			});

			return trace;
		});

		const myGraph = document.querySelector('#myGraph');

		Plotly.newPlot(
			myGraph,
			data,
			{
				title: { text: "折線圖與散佈圖", font: { size: 32 } },
				xaxis: { range: [0, 8] },
				yaxis: { range: [0, 25] }
			},
			{ responsive: true }
		);
	});

	return [];
}

class HW1 extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});
	}
}

var trace1={mode:"markers+text",type:"scatter",name:"Team A",marker:{size:10,color:"blue"},dots:[[1,10,"A1"],[2,15,"A2"],[3,13,"A3"],[4,17,"A4"]],textposition:"bottom center",textfont:{family:"Raleway, sans-serif",size:10}};var trace2={mode:"lines",type:"scatter",name:"Team B",marker:{color:"orange"},dots:[[2,6,"B1"],[3,11,"B2"],[5,20,"B3"],[6,5,"B4"]]};var trace3={visible:true,mode:"lines+markers",type:"scatter",name:"Team C",marker:{size:10,color:"green"},dots:[[1,2,"C1"],[3,4,"C2"],[5,8,"C3"],[7,10,"C4"]]};var dataJSON = {trace1:trace1,trace2:trace2,trace3:trace3};

/* src/pages/HW1_2.svelte generated by Svelte v4.2.1 */

function create_fragment$6(ctx) {
	let div0;
	let t0;
	let div1;

	return {
		c() {
			div0 = element("div");
			t0 = space();
			div1 = element("div");

			div1.innerHTML = `<h1>作業1-2 可互動的折線圖與散佈圖</h1> <p>上面這張圖實質上跟作業1的資料是一樣的，但當時為了方便練習且現在為了方便演示，我仍將它獨立出來。</p> <p>這張圖使用了Plotly.js提供的updatemenus功能，能夠讓使用者操作一個預先設定好的小選單，來即時更改圖顯示的資料等等。
		在這裡我加入了三個選項:</p> <ol><li>show all -- 顯示所有資料</li> <li>blue only -- 只顯示藍色（A隊）的點或線</li> <li>without blue -- 顯示除了藍色（A隊）以外的點或線</li></ol> <p>透過這項功能，假設當有使用者想要從100個隊伍挑出他之前就很關注的兩隊來觀察，就不需要在一旁的圖例欄位點98次。</p>`;

			attr(div0, "id", "myGraph");
			attr(div0, "class", "graph");
			attr(div1, "class", "content is-medium pt-4");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t0, anchor);
			insert(target, div1, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t0);
				detach(div1);
			}
		}
	};
}

function instance$6($$self) {
	onMount(async () => {
		const Plotly = await import('./plotly.min-aa68bb7b.js').then(function (n) { return n.p; });

		const data = Object.values(dataJSON).map(trace => {
			trace['x'] = [];
			trace['y'] = [];
			trace['text'] = [];

			trace['dots'].forEach(v => {
				trace['x'].push(v[0]);
				trace['y'].push(v[1]);
				trace['text'].push(v[2]);
			});

			return trace;
		});

		const myGraph = document.querySelector('#myGraph');

		Plotly.newPlot(myGraph, data, {
			title: { text: "可互動的折線圖與散佈圖", font: { size: 32 } },
			xaxis: { range: [0, 7] },
			yaxis: { range: [0, 25] },
			//from here
			updatemenus: [
				{
					y: 1.2,
					x: 0,
					yanchor: 'top',
					buttons: [
						{
							method: 'restyle',
							args: ['visible', [true, true, true]],
							label: 'show all'
						},
						{
							method: 'restyle',
							args: ['visible', [true, false, false]],
							label: 'blue only'
						},
						{
							method: 'restyle',
							args: ['visible', [false, true, true]],
							label: 'without blue'
						}
					]
				}
			]
		});
	});

	return [];
}

class HW1_2 extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});
	}
}

var taipei={type:"bar",animals:[{name:"lion",count:20},{name:"tiger",count:14},{name:"monkey",count:23}]};var taoyuan={type:"bar",animals:[{name:"lion",count:17},{name:"tiger",count:16},{name:"monkey",count:26}]};var rawData$2 = {taipei:taipei,taoyuan:taoyuan};

/* src/pages/HW2.svelte generated by Svelte v4.2.1 */

function create_default_slot_4$1(ctx) {
	let t;

	return {
		c() {
			t = text("台北");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (87:21) <HL>
function create_default_slot_3$1(ctx) {
	let t;

	return {
		c() {
			t = text("桃園");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (88:11) <HL c='info'>
function create_default_slot_2$1(ctx) {
	let t;

	return {
		c() {
			t = text("獅子");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (88:32) <HL c='info'>
function create_default_slot_1$1(ctx) {
	let t;

	return {
		c() {
			t = text("老虎");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (88:53) <HL c='info'>
function create_default_slot$1(ctx) {
	let t;

	return {
		c() {
			t = text("猴子");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

function create_fragment$5(ctx) {
	let div0;
	let t0;
	let div1;
	let h1;
	let t2;
	let p0;
	let t3;
	let hl0;
	let t4;
	let hl1;
	let t5;
	let hl2;
	let t6;
	let hl3;
	let t7;
	let hl4;
	let t8;
	let t9;
	let p1;
	let t11;
	let p2;
	let t13;
	let p3;
	let current;

	hl0 = new HL({
			props: {
				$$slots: { default: [create_default_slot_4$1] },
				$$scope: { ctx }
			}
		});

	hl1 = new HL({
			props: {
				$$slots: { default: [create_default_slot_3$1] },
				$$scope: { ctx }
			}
		});

	hl2 = new HL({
			props: {
				c: "info",
				$$slots: { default: [create_default_slot_2$1] },
				$$scope: { ctx }
			}
		});

	hl3 = new HL({
			props: {
				c: "info",
				$$slots: { default: [create_default_slot_1$1] },
				$$scope: { ctx }
			}
		});

	hl4 = new HL({
			props: {
				c: "info",
				$$slots: { default: [create_default_slot$1] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			div0 = element("div");
			t0 = space();
			div1 = element("div");
			h1 = element("h1");
			h1.textContent = "作業2 長條圖";
			t2 = space();
			p0 = element("p");
			t3 = text("以上圖表呈現了");
			create_component(hl0.$$.fragment);
			t4 = text("與");
			create_component(hl1.$$.fragment);
			t5 = text("兩地的動物園內動物的假資料。\n\t\t這兩個園區都只有，");
			create_component(hl2.$$.fragment);
			t6 = text("、");
			create_component(hl3.$$.fragment);
			t7 = text("跟");
			create_component(hl4.$$.fragment);
			t8 = text("，這三種動物。\n\t\t在呈現數量時，以長條圖呈現可以很明顯地看到數量的差距，因此，在這裡我們使用分群的長條圖來分別顯示「依動物分群」與「依地點分群」的結果。");
			t9 = space();
			p1 = element("p");
			p1.textContent = "利用Plotly.js作圖後，先以左圖來說，我們可以看到台北的獅子比桃園的多，就算我們看不到白色的實際數量數字也可以直觀地用長條圖長度來判斷。\n\t\t依此類推，也會得出不論是老虎還是猴子，桃園都比較多的結論。";
			t11 = space();
			p2 = element("p");
			p2.textContent = "雖然我們可以直接從左圖長條上的數字看到各項動物的數量，但若要比較一家動物園內的動物數量，則顯得有些麻煩。\n\t\t因此，若我們對地點分群，即左圖，就可以清楚地看到各地每種動物數量多寡。\n\t\t舉例來說，我們可以發現，不論是台北還是桃園，猴子的數量都明顯多於其他兩種動物。對其餘的動物來說，桃園的獅子略多於老虎，而台北則是相反。";
			t13 = space();
			p3 = element("p");
			p3.textContent = "一開始這頁長條圖的作業是真的使用兩張圖來呈現的，但在上完作業3的課程並學到子圖的做法後，便將這裡的兩張圖併成一張。\n\t\t這樣除了方便排版外，也同時讓使用者能一眼就看到所有內容。";
			attr(div0, "id", "myGraph");
			attr(div0, "class", "graph");
			attr(div1, "class", "content is-medium pt-4");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t0, anchor);
			insert(target, div1, anchor);
			append(div1, h1);
			append(div1, t2);
			append(div1, p0);
			append(p0, t3);
			mount_component(hl0, p0, null);
			append(p0, t4);
			mount_component(hl1, p0, null);
			append(p0, t5);
			mount_component(hl2, p0, null);
			append(p0, t6);
			mount_component(hl3, p0, null);
			append(p0, t7);
			mount_component(hl4, p0, null);
			append(p0, t8);
			append(div1, t9);
			append(div1, p1);
			append(div1, t11);
			append(div1, p2);
			append(div1, t13);
			append(div1, p3);
			current = true;
		},
		p(ctx, [dirty]) {
			const hl0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl0_changes.$$scope = { dirty, ctx };
			}

			hl0.$set(hl0_changes);
			const hl1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl1_changes.$$scope = { dirty, ctx };
			}

			hl1.$set(hl1_changes);
			const hl2_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl2_changes.$$scope = { dirty, ctx };
			}

			hl2.$set(hl2_changes);
			const hl3_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl3_changes.$$scope = { dirty, ctx };
			}

			hl3.$set(hl3_changes);
			const hl4_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl4_changes.$$scope = { dirty, ctx };
			}

			hl4.$set(hl4_changes);
		},
		i(local) {
			if (current) return;
			transition_in(hl0.$$.fragment, local);
			transition_in(hl1.$$.fragment, local);
			transition_in(hl2.$$.fragment, local);
			transition_in(hl3.$$.fragment, local);
			transition_in(hl4.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hl0.$$.fragment, local);
			transition_out(hl1.$$.fragment, local);
			transition_out(hl2.$$.fragment, local);
			transition_out(hl3.$$.fragment, local);
			transition_out(hl4.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t0);
				detach(div1);
			}

			destroy_component(hl0);
			destroy_component(hl1);
			destroy_component(hl2);
			destroy_component(hl3);
			destroy_component(hl4);
		}
	};
}

function instance$5($$self) {
	onMount(async () => {
		const Plotly = await import('./plotly.min-aa68bb7b.js').then(function (n) { return n.p; });
		const myGraph = document.querySelector('#myGraph');

		// group by zoo
		let data1 = Object.entries(rawData$2).map(([name, { animals, type }]) => ({
			name: `${name} zoo`,
			type,
			x: animals.map(animal => animal.name),
			y: animals.map(animal => animal.count)
		}));

		data1 = data1.map(_ => ({
			..._,
			text: _.y,
			textfont: { size: 20, color: 'white' }
		}));

		// group by animal
		const animalNames = ['lion', 'tiger', 'monkey'];

		let data2 = new Array(3).fill({}).map((_, i) => ({
			name: animalNames[i],
			type: 'bar',
			x: Object.keys(rawData$2),
			y: Object.values(rawData$2).map(({ animals, type }) => animals[i].count)
		}));

		data2 = data2.map(_ => ({
			..._,
			text: _.y,
			textfont: { size: 20, color: 'white' },
			xaxis: 'x2'
		}));

		Plotly.newPlot(
			myGraph,
			data1.concat(data2),
			{
				title: { text: '動物園數量統計', font: { size: 32 } },
				xaxis: { domain: [0, 0.5] },
				xaxis2: { domain: [0.5, 1] },
				annotations: [
					{
						text: "依「動物」分群",
						font: { size: 15 },
						showarrow: false,
						align: 'center',
						x: 0.15,
						y: 1,
						xref: 'paper',
						yref: 'paper'
					},
					{
						text: "依「地點」分群",
						font: { size: 15 },
						showarrow: false,
						align: 'center',
						x: 0.85,
						y: 1,
						xref: 'paper',
						yref: 'paper'
					}
				]
			},
			{ responsive: true }
		);
	});

	return [];
}

class HW2 extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});
	}
}

var ratio_names=["作業","出席","期中評量","期末評量"];var subjects={"國文":{ratio:[10,20,30,40],holesize:0},"英文":{ratio:[20,0,40,40],holesize:0.5},"數學":{ratio:[0,0,50,50],holesize:0.6},"自然":{ratio:[25,25,25,25],holesize:0.7},"社會":{ratio:[30,20,30,30],holesize:0.8}};var rawData$1 = {ratio_names:ratio_names,subjects:subjects};

/* src/pages/HW3.svelte generated by Svelte v4.2.1 */

function create_default_slot_8(ctx) {
	let t;

	return {
		c() {
			t = text("國文");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (56:25) <HL>
function create_default_slot_7(ctx) {
	let t;

	return {
		c() {
			t = text("英文");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (56:37) <HL>
function create_default_slot_6(ctx) {
	let t;

	return {
		c() {
			t = text("數學");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (56:49) <HL>
function create_default_slot_5(ctx) {
	let t;

	return {
		c() {
			t = text("自然");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (56:61) <HL>
function create_default_slot_4(ctx) {
	let t;

	return {
		c() {
			t = text("社會");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (57:18) <HL c='info'>
function create_default_slot_3(ctx) {
	let t;

	return {
		c() {
			t = text("期中評量");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (57:41) <HL c='info'>
function create_default_slot_2(ctx) {
	let t;

	return {
		c() {
			t = text("期末評量");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (58:2) <HL c='info'>
function create_default_slot_1(ctx) {
	let t;

	return {
		c() {
			t = text("出席");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (58:23) <HL c='info'>
function create_default_slot(ctx) {
	let t;

	return {
		c() {
			t = text("作業");
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

function create_fragment$4(ctx) {
	let div0;
	let t0;
	let div1;
	let h1;
	let t2;
	let p0;
	let t3;
	let hl0;
	let t4;
	let hl1;
	let t5;
	let hl2;
	let t6;
	let hl3;
	let t7;
	let hl4;
	let t8;
	let hl5;
	let t9;
	let hl6;
	let t10;
	let hl7;
	let t11;
	let hl8;
	let t12;
	let t13;
	let p1;
	let current;

	hl0 = new HL({
			props: {
				$$slots: { default: [create_default_slot_8] },
				$$scope: { ctx }
			}
		});

	hl1 = new HL({
			props: {
				$$slots: { default: [create_default_slot_7] },
				$$scope: { ctx }
			}
		});

	hl2 = new HL({
			props: {
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			}
		});

	hl3 = new HL({
			props: {
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			}
		});

	hl4 = new HL({
			props: {
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			}
		});

	hl5 = new HL({
			props: {
				c: "info",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			}
		});

	hl6 = new HL({
			props: {
				c: "info",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			}
		});

	hl7 = new HL({
			props: {
				c: "info",
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			}
		});

	hl8 = new HL({
			props: {
				c: "info",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			div0 = element("div");
			t0 = space();
			div1 = element("div");
			h1 = element("h1");
			h1.textContent = "作業3 圓餅圖";
			t2 = space();
			p0 = element("p");
			t3 = text("以上圖表列出了某學生，");
			create_component(hl0.$$.fragment);
			t4 = text("、");
			create_component(hl1.$$.fragment);
			t5 = text("、");
			create_component(hl2.$$.fragment);
			t6 = text("、");
			create_component(hl3.$$.fragment);
			t7 = text("與");
			create_component(hl4.$$.fragment);
			t8 = text("，共五科目學期成績評分比例的假資料。\n\t\t剛好這些科目無一例外都只會參採，");
			create_component(hl5.$$.fragment);
			t9 = text("、");
			create_component(hl6.$$.fragment);
			t10 = text("、\n\t\t");
			create_component(hl7.$$.fragment);
			t11 = text("與");
			create_component(hl8.$$.fragment);
			t12 = text("，這四種成績，以計算學期成績。\n\t\t但是每個科目分配的比例不同，換句話說，對參採項目的比重不同，因此，可以使用圓餅圖來清楚地表達各個科目的比例。");
			t13 = space();
			p1 = element("p");
			p1.textContent = "利用Plotly.js作圖後，上圖五個圓餅圖分別代表五個科目的比例，其中中央挖空的比例依序是0、0.5、0.6、0.7、0.8。\n\t\t由於國文的圓餅圖並沒有挖空，該圖的標題會跑到圖的上面進而限縮了該子圖的繪圖空間。因此代表國文的圓餅圖實際上是比其他圖來得小；\n\t\t反過來說，其餘四張圖由於中央有挖空，基於Plotly的機制，會把標題塞在洞裡面，因此只要開洞夠大就能確保標題能夠清楚顯示。\n\t\t由於這只是圓餅圖與多子圖排列的練習，我們並不在乎是否能很好的維持整齊的排列，但在往後使用時，應當全部都挖相同大小的洞或是都不挖\n\t\t，進而確保實際上的圓餅圖大小相圖，以利觀察與判斷。";
			attr(div0, "id", "myGraph");
			attr(div0, "class", "graph");
			attr(div1, "class", "content is-medium pt-4");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t0, anchor);
			insert(target, div1, anchor);
			append(div1, h1);
			append(div1, t2);
			append(div1, p0);
			append(p0, t3);
			mount_component(hl0, p0, null);
			append(p0, t4);
			mount_component(hl1, p0, null);
			append(p0, t5);
			mount_component(hl2, p0, null);
			append(p0, t6);
			mount_component(hl3, p0, null);
			append(p0, t7);
			mount_component(hl4, p0, null);
			append(p0, t8);
			mount_component(hl5, p0, null);
			append(p0, t9);
			mount_component(hl6, p0, null);
			append(p0, t10);
			mount_component(hl7, p0, null);
			append(p0, t11);
			mount_component(hl8, p0, null);
			append(p0, t12);
			append(div1, t13);
			append(div1, p1);
			current = true;
		},
		p(ctx, [dirty]) {
			const hl0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl0_changes.$$scope = { dirty, ctx };
			}

			hl0.$set(hl0_changes);
			const hl1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl1_changes.$$scope = { dirty, ctx };
			}

			hl1.$set(hl1_changes);
			const hl2_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl2_changes.$$scope = { dirty, ctx };
			}

			hl2.$set(hl2_changes);
			const hl3_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl3_changes.$$scope = { dirty, ctx };
			}

			hl3.$set(hl3_changes);
			const hl4_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl4_changes.$$scope = { dirty, ctx };
			}

			hl4.$set(hl4_changes);
			const hl5_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl5_changes.$$scope = { dirty, ctx };
			}

			hl5.$set(hl5_changes);
			const hl6_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl6_changes.$$scope = { dirty, ctx };
			}

			hl6.$set(hl6_changes);
			const hl7_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl7_changes.$$scope = { dirty, ctx };
			}

			hl7.$set(hl7_changes);
			const hl8_changes = {};

			if (dirty & /*$$scope*/ 1) {
				hl8_changes.$$scope = { dirty, ctx };
			}

			hl8.$set(hl8_changes);
		},
		i(local) {
			if (current) return;
			transition_in(hl0.$$.fragment, local);
			transition_in(hl1.$$.fragment, local);
			transition_in(hl2.$$.fragment, local);
			transition_in(hl3.$$.fragment, local);
			transition_in(hl4.$$.fragment, local);
			transition_in(hl5.$$.fragment, local);
			transition_in(hl6.$$.fragment, local);
			transition_in(hl7.$$.fragment, local);
			transition_in(hl8.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hl0.$$.fragment, local);
			transition_out(hl1.$$.fragment, local);
			transition_out(hl2.$$.fragment, local);
			transition_out(hl3.$$.fragment, local);
			transition_out(hl4.$$.fragment, local);
			transition_out(hl5.$$.fragment, local);
			transition_out(hl6.$$.fragment, local);
			transition_out(hl7.$$.fragment, local);
			transition_out(hl8.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t0);
				detach(div1);
			}

			destroy_component(hl0);
			destroy_component(hl1);
			destroy_component(hl2);
			destroy_component(hl3);
			destroy_component(hl4);
			destroy_component(hl5);
			destroy_component(hl6);
			destroy_component(hl7);
			destroy_component(hl8);
		}
	};
}

function instance$4($$self) {
	onMount(async () => {
		const Plotly = await import('./plotly.min-aa68bb7b.js').then(function (n) { return n.p; });
		const myGraph = document.querySelector('#myGraph');
		let data = [];

		Object.keys(rawData$1['subjects']).forEach((subjectName, i) => {
			data[i] = {
				type: 'pie',
				title: { text: subjectName, font: { size: 15 } },
				values: rawData$1['subjects'][subjectName]['ratio'],
				labels: rawData$1['ratio_names'],
				domain: { row: Math.floor(i / 3), column: i % 3 },
				hole: rawData$1['subjects'][subjectName]['holesize']
			};
		});

		Plotly.newPlot(
			myGraph,
			data,
			{
				title: { text: '科目分配比例', font: { size: 32 } },
				grid: { rows: 2, columns: 3, ygap: 0.2 }
			},
			{ responsive: true }
		);
	});

	return [];
}

class HW3 extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});
	}
}

var rawData = [ { zhy:"108",
    m:"1",
    volume:"69360" },
  { zhy:"108",
    m:"2",
    volume:"71525" },
  { zhy:"108",
    m:"3",
    volume:"70824" },
  { zhy:"108",
    m:"4",
    volume:"72810" },
  { zhy:"108",
    m:"5",
    volume:"72080" },
  { zhy:"108",
    m:"6",
    volume:"75929" },
  { zhy:"108",
    m:"7",
    volume:"77830" },
  { zhy:"108",
    m:"8",
    volume:"79805" },
  { zhy:"108",
    m:"9",
    volume:"76235" },
  { zhy:"108",
    m:"10",
    volume:"83208" },
  { zhy:"108",
    m:"11",
    volume:"79969" },
  { zhy:"108",
    m:"12",
    volume:"89204" },
  { zhy:"109",
    m:"1",
    volume:"82810" },
  { zhy:"109",
    m:"2",
    volume:"58868" },
  { zhy:"109",
    m:"3",
    volume:"40737" },
  { zhy:"109",
    m:"4",
    volume:"33621" },
  { zhy:"109",
    m:"5",
    volume:"37933" },
  { zhy:"109",
    m:"6",
    volume:"43162" },
  { zhy:"109",
    m:"7",
    volume:"48160" },
  { zhy:"109",
    m:"8",
    volume:"53257" },
  { zhy:"109",
    m:"9",
    volume:"51550" },
  { zhy:"109",
    m:"10",
    volume:"51720" },
  { zhy:"109",
    m:"11",
    volume:"51668" },
  { zhy:"109",
    m:"12",
    volume:"53423" },
  { zhy:"110",
    m:"1",
    volume:"46793" },
  { zhy:"110",
    m:"2",
    volume:"41855" },
  { zhy:"110",
    m:"3",
    volume:"49168" },
  { zhy:"110",
    m:"4",
    volume:"50673" },
  { zhy:"110",
    m:"5",
    volume:"27172" },
  { zhy:"110",
    m:"6",
    volume:"14197" },
  { zhy:"110",
    m:"7",
    volume:"18872" },
  { zhy:"110",
    m:"8",
    volume:"29476" },
  { zhy:"110",
    m:"9",
    volume:"33598" },
  { zhy:"110",
    m:"10",
    volume:"42215" },
  { zhy:"110",
    m:"11",
    volume:"46668" },
  { zhy:"110",
    m:"12",
    volume:"51258" },
  { zhy:"111",
    m:"1",
    volume:"40012" },
  { zhy:"111",
    m:"2",
    volume:"39098" },
  { zhy:"111",
    m:"3",
    volume:"47692" },
  { zhy:"111",
    m:"4",
    volume:"39609" },
  { zhy:"111",
    m:"5",
    volume:"30877" },
  { zhy:"111",
    m:"6",
    volume:"36888" },
  { zhy:"111",
    m:"7",
    volume:"44951" },
  { zhy:"111",
    m:"8",
    volume:"48921" },
  { zhy:"111",
    m:"9",
    volume:"48863" },
  { zhy:"111",
    m:"10",
    volume:"53097" },
  { zhy:"111",
    m:"11",
    volume:"61492" },
  { zhy:"111",
    m:"12",
    volume:"72154" },
  { zhy:"112",
    m:"1",
    volume:"69207" },
  { zhy:"112",
    m:"2",
    volume:"74697" },
  { zhy:"112",
    m:"3",
    volume:"78160" },
  { zhy:"112",
    m:"4",
    volume:"79755" },
  { zhy:"112",
    m:"5",
    volume:"80102" },
  { zhy:"112",
    m:"6",
    volume:"84347" },
  { zhy:"112",
    m:"7",
    volume:"92396" },
  { zhy:"112",
    m:"8",
    volume:"100574" },
  { zhy:"112",
    m:"9",
    volume:"100648" } ];

/* src/pages/RealData.svelte generated by Svelte v4.2.1 */

function create_fragment$3(ctx) {
	let div0;
	let t0;
	let div1;

	return {
		c() {
			div0 = element("div");
			t0 = space();
			div1 = element("div");

			div1.innerHTML = `<h1>練習 真實資料</h1> <p>上圖是112年桃園機捷單月平均日運量的折線圖。由於這些數字都很大，所以我把y軸限定在6e4 ~ 1.2e5的區間內。
		從112年的1月開始平均日運量不斷上升，尤其是5~8月有明顯的上升。雖然最後8~9月的上升趨於平緩，但整體來說桃園機捷單月平均日運量是呈現上漲趨勢的。</p> <p>就像在作業1 發現的一樣，折線圖很適合用來呈現趨勢變化，以這份數據來說，我看到折線圖便能很輕易地發現運量在上漲。
		客觀來說 (100648-69207)/69207≈0.45，這九個月來運量上漲了四成五。
		因此不論就主觀的折線圖趨勢觀察與客觀的計算分析都能得出「桃園機捷的搭乘人數有明顯上升」的結論。</p> <p class="subtitle">（資料來源：<a href="https://data.gov.tw/dataset/164956">政府資料開放平臺</a>）</p>`;

			attr(div0, "id", "myGraph");
			attr(div0, "class", "graph");
			attr(div1, "class", "content is-medium pt-4");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t0, anchor);
			insert(target, div1, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t0);
				detach(div1);
			}
		}
	};
}

function instance$3($$self) {
	let data = rawData.filter(x => x['zhy'] / 1 == 112);

	data = {
		mode: "lines+markers+text",
		type: "scatter",
		marker: { "size": 10 },
		x: data.map(x => x['m'] / 1),
		y: data.map(x => x['volume'] / 1),
		text: data.map(x => x['volume']),
		textposition: "top center"
	};

	onMount(async () => {
		const Plotly = await import('./plotly.min-aa68bb7b.js').then(function (n) { return n.p; });
		const myGraph = document.querySelector('#myGraph');

		Plotly.newPlot(myGraph, [data], {
			title: { text: "每月桃園捷運平均日運量", font: { size: 32 } },
			yaxis: { range: [6e4, 1.2e5] }
		});
	});

	return [];
}

class RealData extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});
	}
}

const Pages = [
    {
        name: '首頁',
        icon: faHouse,
        page: Home
    },
    {
        name: '作業 1',
        icon: faChartLine,
        page: HW1
    },
    {
        name: '作業 1-2',
        icon: faChartLine,
        page: HW1_2
    },
    {
        name: '作業 2',
        icon: faChartColumn,
        page: HW2
    },
    {
        name: '作業 3',
        icon: faChartPie,
        page: HW3
    },
    {
        name: '真實資料',
        icon: faChartColumn,
        page: RealData
    }
];

/* src/components/Nav.svelte generated by Svelte v4.2.1 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	child_ctx[4] = i;
	return child_ctx;
}

// (14:2) {#each Pages as page, i}
function create_each_block(ctx) {
	let li;
	let a;
	let span;
	let fa;
	let t;
	let current;
	let mounted;
	let dispose;

	fa = new Fa$1({
			props: {
				class: "faicon",
				icon: /*page*/ ctx[2]['icon']
			}
		});

	function click_handler() {
		return /*click_handler*/ ctx[1](/*page*/ ctx[2]);
	}

	return {
		c() {
			li = element("li");
			a = element("a");
			span = element("span");
			create_component(fa.$$.fragment);
			t = space();
			attr(span, "class", "icon svelte-1uq27zi");
			attr(a, "class", "px-2 svelte-1uq27zi");
			attr(li, "data-tooltip", /*page*/ ctx[2]['name']);
			set_style(li, "cursor", "default");
			attr(li, "class", "svelte-1uq27zi");
			toggle_class(li, "active", /*nowViewing*/ ctx[0] == /*page*/ ctx[2]['name']);
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, a);
			append(a, span);
			mount_component(fa, span, null);
			append(li, t);
			current = true;

			if (!mounted) {
				dispose = listen(a, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (!current || dirty & /*nowViewing*/ 1) {
				toggle_class(li, "active", /*nowViewing*/ ctx[0] == /*page*/ ctx[2]['name']);
			}
		},
		i(local) {
			if (current) return;
			transition_in(fa.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(fa.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(li);
			}

			destroy_component(fa);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$2(ctx) {
	let div;
	let ul;
	let current;
	let each_value = ensure_array_like(Pages);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = element("div");
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(ul, "class", "svelte-1uq27zi");
			attr(div, "class", "tabs is-large is-centered svelte-1uq27zi");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(ul, null);
				}
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*nowViewing*/ 1) {
				each_value = ensure_array_like(Pages);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(ul, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { nowViewing } = $$props;

	onMount(() => {
		for (let faicon of document.getElementsByClassName('faicon')) {
			faicon.style.height = 'auto';
		}
	});

	const click_handler = page => {
		$$invalidate(0, nowViewing = page['name']);
	};

	$$self.$$set = $$props => {
		if ('nowViewing' in $$props) $$invalidate(0, nowViewing = $$props.nowViewing);
	};

	return [nowViewing, click_handler];
}

class Nav extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { nowViewing: 0 });
	}
}

/* src/components/Viewer.svelte generated by Svelte v4.2.1 */

function create_else_block(ctx) {
	let t0;
	let t1;

	return {
		c() {
			t0 = text(/*nowViewing*/ ctx[0]);
			t1 = text(" has no content");
		},
		m(target, anchor) {
			insert(target, t0, anchor);
			insert(target, t1, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*nowViewing*/ 1) set_data(t0, /*nowViewing*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(t1);
			}
		}
	};
}

// (7:1) {#if nowPage.hasOwnProperty('page')}
function create_if_block(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	var switch_value = /*nowPage*/ ctx[1]['page'];

	function switch_props(ctx, dirty) {
		return {};
	}

	if (switch_value) {
		switch_instance = construct_svelte_component(switch_value, switch_props());
	}

	return {
		c() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m(target, anchor) {
			if (switch_instance) mount_component(switch_instance, target, anchor);
			insert(target, switch_instance_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*nowPage*/ 2 && switch_value !== (switch_value = /*nowPage*/ ctx[1]['page'])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component(switch_value, switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			}
		},
		i(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(switch_instance_anchor);
			}

			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};
}

function create_fragment$1(ctx) {
	let div;
	let show_if;
	let current_block_type_index;
	let if_block;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (dirty & /*nowPage*/ 2) show_if = null;
		if (show_if == null) show_if = !!/*nowPage*/ ctx[1].hasOwnProperty('page');
		if (show_if) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div = element("div");
			if_block.c();
			attr(div, "class", "box");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if_blocks[current_block_type_index].m(div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(div, null);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			if_blocks[current_block_type_index].d();
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let nowPage;
	let { nowViewing } = $$props;

	$$self.$$set = $$props => {
		if ('nowViewing' in $$props) $$invalidate(0, nowViewing = $$props.nowViewing);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*nowViewing*/ 1) {
			$$invalidate(1, nowPage = Pages.find(p => p.name == nowViewing));
		}
	};

	return [nowViewing, nowPage];
}

class Viewer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { nowViewing: 0 });
	}
}

/* src/App.svelte generated by Svelte v4.2.1 */

function create_fragment(ctx) {
	let div;
	let nav;
	let updating_nowViewing;
	let t;
	let viewer;
	let updating_nowViewing_1;
	let current;

	function nav_nowViewing_binding(value) {
		/*nav_nowViewing_binding*/ ctx[1](value);
	}

	let nav_props = {};

	if (/*nowViewing*/ ctx[0] !== void 0) {
		nav_props.nowViewing = /*nowViewing*/ ctx[0];
	}

	nav = new Nav({ props: nav_props });
	binding_callbacks.push(() => bind(nav, 'nowViewing', nav_nowViewing_binding));

	function viewer_nowViewing_binding(value) {
		/*viewer_nowViewing_binding*/ ctx[2](value);
	}

	let viewer_props = {};

	if (/*nowViewing*/ ctx[0] !== void 0) {
		viewer_props.nowViewing = /*nowViewing*/ ctx[0];
	}

	viewer = new Viewer({ props: viewer_props });
	binding_callbacks.push(() => bind(viewer, 'nowViewing', viewer_nowViewing_binding));

	return {
		c() {
			div = element("div");
			create_component(nav.$$.fragment);
			t = space();
			create_component(viewer.$$.fragment);
			attr(div, "class", "column is-8 is-offset-2 pb-6 svelte-p8ny3h");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(nav, div, null);
			append(div, t);
			mount_component(viewer, div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const nav_changes = {};

			if (!updating_nowViewing && dirty & /*nowViewing*/ 1) {
				updating_nowViewing = true;
				nav_changes.nowViewing = /*nowViewing*/ ctx[0];
				add_flush_callback(() => updating_nowViewing = false);
			}

			nav.$set(nav_changes);
			const viewer_changes = {};

			if (!updating_nowViewing_1 && dirty & /*nowViewing*/ 1) {
				updating_nowViewing_1 = true;
				viewer_changes.nowViewing = /*nowViewing*/ ctx[0];
				add_flush_callback(() => updating_nowViewing_1 = false);
			}

			viewer.$set(viewer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(nav.$$.fragment, local);
			transition_in(viewer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(nav.$$.fragment, local);
			transition_out(viewer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_component(nav);
			destroy_component(viewer);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let nowViewing = '首頁';

	function nav_nowViewing_binding(value) {
		nowViewing = value;
		$$invalidate(0, nowViewing);
	}

	function viewer_nowViewing_binding(value) {
		nowViewing = value;
		$$invalidate(0, nowViewing);
	}

	return [nowViewing, nav_nowViewing_binding, viewer_nowViewing_binding];
}

class App extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

new App({
	target: document.body
});
//# sourceMappingURL=main.js.map
